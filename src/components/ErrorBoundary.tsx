import { Component, type ErrorInfo, type ReactNode } from 'react';
import { registrarErrorFrontend } from '../services/errorService';

/* 
    Para capturar errores de renderizado dentro del árbol de React y enviarlos a POST /api/errores, se necesita un 
    componente de clase con getDerivedStateFromError y componentDidCatch (los hooks funcionales no tienen equivalente 
    para esto en React).
    Aquí creamos un componente ErrorBoundary y en src/main.tsx se envuelve <App/> en src/main.tsx.
*/

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  tieneError: boolean;
  mensajeError: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    tieneError: false,
    mensajeError: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      tieneError: true,
      mensajeError: error.message || 'Ocurrió un error inesperado al mostrar la pantalla.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    void registrarErrorFrontend({
      mensaje: error.message || 'Error de renderizado en React',
      stackTrace: info.componentStack || error.stack,
      tipoError: error.name || 'ReactRenderError',
    });
  }

  private reintentar = () => {
    this.setState({ tieneError: false, mensajeError: '' });
  };

  render() {
    if (this.state.tieneError) {
      return (
        <main className="pagina-acceso">
          <div className="tarjeta">
            <h2>Algo salió mal</h2>
            <p className="mensaje-error">{this.state.mensajeError}</p>
            <button type="button" onClick={this.reintentar} className="btn btn-lima">
              Reintentar
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}