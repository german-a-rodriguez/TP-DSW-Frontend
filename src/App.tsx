import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { AdminPage } from './pages/admin/AdminPage';
import { EntrenadorPage } from './pages/entrenador/EntrenadorPage';
import { ClientePage } from './pages/cliente/ClientePage';
import { parseJwt } from './utils/auth';
import './App.css';

// Vistas disponibles para usuarios sin sesión
type VistaPublica = 'login' | 'autorregistro';

// Función para obtener la sesión válida desde el localStorage
// Si no pudo leer el usuario o el token venció, elimina token y rol y devuelve null.
function obtenerSesionValida() {
  const token = localStorage.getItem('token');
  const usuario = token ? parseJwt(token) : null;
  if (!usuario || (usuario.exp && usuario.exp * 1000 <= Date.now())) {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    return null;
  }
  return { token, rol: usuario.rol };
}

export function App() {
  const [sesion, setSesion] = useState(obtenerSesionValida);
  const [vistaPublica, setVistaPublica] = useState<VistaPublica>('login');

  // Guarda la sesión en el estado
  const handleLoginSuccess = (token: string, rol: string) => {
    setSesion({ token, rol });
  };

  // Función para cerrar la sesión activa del usuario
  const handleLogout = () => {
    // Eliminamos el token y rol de la memoria peristente del navegador
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    // Limpiamos la sesión en el estado de la aplicación y redirigimos al login
    setSesion(null);
    setVistaPublica('login');
  };

  if (sesion) {
    switch (sesion.rol) {
      case 'admin':
        return <AdminPage onLogout={handleLogout} />;
      case 'entrenador':
        return <EntrenadorPage onLogout={handleLogout} />;
      case 'cliente':
        return <ClientePage onLogout={handleLogout} />;
      default:
        return (
          <main className="pagina-acceso">
            <h2>Rol desconocido o no autorizado.</h2>
            <button onClick={handleLogout} className="btn btn-rojo">
              Cerrar sesión
            </button>
          </main>
        );
    }
  }

  return (
    <>
      <nav className="barra-publica" aria-label="Acceso">
        <button
          onClick={() => setVistaPublica('login')}
          className={vistaPublica === 'login' ? 'btn btn-azul' : 'btn btn-gris'}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setVistaPublica('autorregistro')}
          className={
            vistaPublica === 'autorregistro' ? 'btn btn-verde' : 'btn btn-gris'
          }
        >
          Registrarse
        </button>
      </nav>
      {vistaPublica === 'login' ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setVistaPublica('autorregistro')}
        />
      ) : (
        <RegistroPage
          onRegisterSuccess={() => setVistaPublica('login')}
          onGoToLogin={() => setVistaPublica('login')}
        />
      )}
    </>
  );
}

export default App;
