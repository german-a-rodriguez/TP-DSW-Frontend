import { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { AdminPage } from './pages/admin/AdminPage';
import { EntrenadorPage } from './pages/entrenador/EntrenadorPage';
import { ClientePage } from './pages/cliente/ClientePage';
import { parseJwt } from './utils/auth';
import './App.css';

// Vistas disponibles para usuarios sin sesión
type VistaPublica = 'login' | 'autorregistro';

// Función para determinar la vista pública actual según la URL
function obtenerVistaDesdeUrl(): VistaPublica {
  return window.location.pathname === '/registro' ? 'autorregistro' : 'login';
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

  // Una vez que la pantalla se dibujó por primera vez, activamos la escucha
  // de eventos del navegador (flechas atrás/adelante y sesión expirada)
  useEffect(() => {
    // Cuando se ejecute, lee la URL y actualiza la vista
    const cambiarVista = () => setVistaPublica(obtenerVistaDesdeUrl());

    // Cuando se ejecute, quita la sesion del estado y redirige al login
    const cerrarSesionExpirada = () => {
      setSesion(null);
      window.history.pushState(null, '', '/login');
      setVistaPublica('login');
    };

    // Actualiza la vista al usar atras o adelante del navegador.
    window.addEventListener('popstate', cambiarVista);

    // Cierra la sesión cuando api.ts avisa que ya no es válida.
    window.addEventListener('sesion-expirada', cerrarSesionExpirada);

    // Quitamos las escuchas cuando el componente se desmonta
    return () => {
      window.removeEventListener('popstate', cambiarVista);
      window.removeEventListener('sesion-expirada', cerrarSesionExpirada);
    };
  }, []);

  // Actualiza la URL con pushState, sin recargar la página, y cambia la vista
  const navegar = (vista: VistaPublica) => {
    const ruta = vista === 'autorregistro' ? '/registro' : '/login';
    if (window.location.pathname !== ruta)
      window.history.pushState(null, '', ruta);
    setVistaPublica(vista);
  };

  // Guarda la sesión en el estado y cambia la URL a /
  const handleLoginSuccess = (token: string, rol: string) => {
    setSesion({ token, rol });
    window.history.pushState(null, '', '/');
  };

  // Función para cerrar la sesión activa del usuario
  const handleLogout = () => {
    // Eliminamos el token y rol de la memoria peristente del navegador
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    // Limpiamos la sesión en el estado de la aplicación y redirigimos al login
    setSesion(null);
    navegar('login');
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
          onClick={() => navegar('login')}
          className={vistaPublica === 'login' ? 'btn btn-azul' : 'btn btn-gris'}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => navegar('autorregistro')}
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
          onGoToRegister={() => navegar('autorregistro')}
        />
      ) : (
        <RegistroPage
          onRegisterSuccess={() => navegar('login')}
          onGoToLogin={() => navegar('login')}
        />
      )}
    </>
  );
}

export default App;
