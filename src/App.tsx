import { useEffect, useState } from 'react';
import { InicioPage } from './vistas-publicas/InicioPage';
import { LoginPage } from './vistas-publicas/LoginPage';
import { RegistroPage } from './vistas-publicas/RegistroPage';
import { AdminPage } from './paneles/AdminPage';
import { EntrenadorPage } from './paneles/EntrenadorPage';
import { ClientePage } from './paneles/ClientePage';
import { parseJwt } from './utils/auth';

// Vistas disponibles para usuarios sin sesión
type VistaPublica = 'inicio' | 'login' | 'autorregistro';

function obtenerVistaDesdeUrl(): VistaPublica {
  if (window.location.pathname === '/login') return 'login';
  if (window.location.pathname === '/registro') return 'autorregistro';
  return 'inicio';
}

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
  const [vistaPublica, setVistaPublica] =
    useState<VistaPublica>(obtenerVistaDesdeUrl);
  const [avisoSesion, setAvisoSesion] = useState('');

  // Sincroniza las vistas públicas con el historial y los avisos de sesión vencida.
  useEffect(() => {
    const manejarHistorial = () => {
      setVistaPublica(obtenerVistaDesdeUrl());
      setAvisoSesion('');
    };
    const manejarSesionExpirada = () => {
      setSesion(null);
      if (window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
      setVistaPublica('login');
      setAvisoSesion('Tu sesión venció. Iniciá sesión nuevamente.');
    };

    window.addEventListener('popstate', manejarHistorial);
    window.addEventListener('sesion-expirada', manejarSesionExpirada);
    return () => {
      window.removeEventListener('popstate', manejarHistorial);
      window.removeEventListener('sesion-expirada', manejarSesionExpirada);
    };
  }, []);

  const navegarAVistaPublica = (vista: VistaPublica) => {
    const ruta =
      vista === 'login'
        ? '/login'
        : vista === 'autorregistro'
          ? '/registro'
          : '/';
    if (window.location.pathname !== ruta) {
      window.history.pushState(null, '', ruta);
    }
    setVistaPublica(vista);
    setAvisoSesion('');
  };

  // Guarda la sesión en el estado
  const handleLoginSuccess = (token: string, rol: string) => {
    setSesion({ token, rol });
    navegarAVistaPublica('inicio');
  };

  // Función para cerrar la sesión activa del usuario
  const handleLogout = () => {
    // Eliminamos el token y rol de la memoria peristente del navegador
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    // Limpiamos la sesión en el estado de la aplicación y volvemos a la portada
    setSesion(null);
    navegarAVistaPublica('inicio');
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
          type="button"
          className="marca-gym"
          aria-label="Nexus Gym: ir al inicio"
          onClick={() => navegarAVistaPublica('inicio')}
        >
          <div>
            <span>NEXUS</span> GYM
          </div>
        </button>
        <div className="acciones-celda">
          <button
            onClick={() => navegarAVistaPublica('login')}
            className="btn btn-texto"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navegarAVistaPublica('autorregistro')}
            className="btn btn-lima"
          >
            Registrarse
          </button>
        </div>
      </nav>
      {vistaPublica === 'inicio' && (
        <InicioPage
          onGoToLogin={() => navegarAVistaPublica('login')}
          onGoToRegister={() => navegarAVistaPublica('autorregistro')}
        />
      )}
      {vistaPublica === 'login' && (
        <LoginPage
          avisoSesion={avisoSesion}
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => navegarAVistaPublica('autorregistro')}
        />
      )}
      {vistaPublica === 'autorregistro' && (
        <RegistroPage
          onRegisterSuccess={() => navegarAVistaPublica('login')}
          onGoToLogin={() => navegarAVistaPublica('login')}
        />
      )}
    </>
  );
}

export default App;
