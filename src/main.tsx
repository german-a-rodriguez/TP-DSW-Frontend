import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registrarErrorFrontend } from './services/errorService.ts';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';
import './estilos/compartidos.css';
import './vistas-publicas/vistas-publicas.css';
import './paneles/paneles.css';
import './components/ListadoCrud.css';
import './paneles/DashboardCliente.css';
import App from './App.tsx';

window.addEventListener('error', (event) => {
  registrarErrorFrontend({
    mensaje: event.error instanceof Error ? event.error.message : event.message || 'Error no capturado',
    stackTrace: event.error instanceof Error ? event.error.stack : undefined,
    tipoError: event.error instanceof Error ? event.error.name : 'WindowError',
  });
});

window.addEventListener('unhandledrejection', (event) => {
  const razon = event.reason;
  registrarErrorFrontend({
    mensaje: razon instanceof Error ? razon.message : String(razon || 'Promesa rechazada sin manejar'),
    stackTrace: razon instanceof Error ? razon.stack : undefined,
    tipoError: razon instanceof Error ? razon.name : 'UnhandledRejection',
  });
});

/* 
    Para capturar errores de renderizado dentro del árbol de React y enviarlos a POST /api/errores, se necesita un 
    componente de clase con getDerivedStateFromError y componentDidCatch (los hooks funcionales no tienen equivalente 
    para esto en React).
    En components > ErrorBoundary.tsx creamos un componente ErrorBoundary y aquí en src/main.tsx se envuelve <App/>.

    Esto logra:
    Se captura renderizado y ciclo de vida: si un componente lanza una excepción durante el render o en un efecto/ciclo de 
    vida capturado por React, no deja la pantalla en blanco sin aviso.
    Envía componentStack: en componentDidCatch se pasa info.componentStack (o error.stack) a registrarErrorFrontend, lo 
    que ayuda a ubicar en qué componente ocurrió el fallo dentro de errores_log y error.log.
    Recuperación simple: el botón Reintentar limpia el estado de error sin recargar toda la página (a menos que el mismo 
    error vuelva a ocurrir al renderizar).
*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
