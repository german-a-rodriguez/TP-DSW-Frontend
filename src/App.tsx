// Importamos el hook useState desde la librería de React para manejar el estado local del componente
import { useState } from 'react';

// Importamos el componente de Login (formulario de inicio de sesión)
import { LoginForm } from './components/LoginForm';
import { AutorregistroForm } from './components/AutorregistroForm.tsx';

// Importamos los tableros o paneles exclusivos para cada uno de los roles
import { AdminMenu } from './components/AdminMenu';
import { EntrenadorMenu } from './components/EntrenadorMenu';
import { ClienteMenu } from './components/ClienteMenu';

import './App.css'


export function App() {
  // Estado para almacenar el token JWT. 
  // Usamos una función flecha () => localStorage.getItem(...) para leer el almacenamiento del navegador 
  // una sola vez al cargar la aplicación, evitando re-renders innecesarios.
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  // Estado para almacenar el rol del usuario logueado ('admin', 'cliente' o 'entrenador')
  const [rol, setRol] = useState<string | null>(() => localStorage.getItem('rol'));

  // ESTADO NUEVO: Controla qué vista pública mostrar cuando el usuario NO está logueado.
  // Puede ser 'login' o 'autorregistro'. Por defecto arranca en 'login'.
  const [vistaPublica, setVistaPublica] = useState<'login' | 'autorregistro'>('login');

  // Función callback que se ejecutará cuando el login en el componente hijo (Login.tsx) sea exitoso.
  // Recibe el nuevo token y el rol decodificado como parámetros.
  const handleLoginSuccess = (newToken: string, newRol: string) => {
    // Actualizamos el estado local del token con el valor recibido
    setToken(newToken);
    // Actualizamos el estado local del rol con el valor recibido
    setRol(newRol);
  };

  // Función para cerrar la sesión activa del usuario
  const handleLogout = () => {
    // Eliminamos el token de la memoria persistente del navegador
    localStorage.removeItem('token');
    // Eliminamos el rol guardado en la memoria del navegador
    localStorage.removeItem('rol');
    // Reiniciamos el estado del token a null para forzar el renderizado de la pantalla de Login
    setToken(null);
    // Reiniciamos el estado del rol a null
    setRol(null);
    setVistaPublica('login'); // Al salir, lo devolvemos al login
  };

// 1. CONTROL DE ACCESO PRIVADO: Si el usuario ya tiene token, ignoramos las vistas públicas
  // y mostramos directamente su panel correspondiente según su rol.
  if (token) {
    switch (rol) {
      case 'admin':
        return <AdminMenu onLogout={handleLogout} />;
      case 'entrenador':
        return <EntrenadorMenu onLogout={handleLogout} />;
      case 'cliente':
        return <ClienteMenu onLogout={handleLogout} />;
      default:
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Rol desconocido o no autorizado.</h2>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        );
    }
  }

  // 2. CONTROL DE VISTAS PÚBLICAS: Si el usuario NO está logueado, 
  // le permitimos navegar entre el formulario de Login y el de Registro mediante botones accesibles.
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Barra de navegación pública superior (disponible en todas las páginas públicas) */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '15px', background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <button 
          onClick={() => setVistaPublica('login')}
          style={{ padding: '8px 15px', background: vistaPublica === 'login' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Iniciar Sesión
        </button>

        <button 
          onClick={() => setVistaPublica('autorregistro')}
          style={{ padding: '8px 15px', background: vistaPublica === 'autorregistro' ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Registrarse
        </button>
      </nav>

      {
        /* Renderizado condicional de la pantalla pública activa */
      }
      {vistaPublica === 'login' ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AutorregistroForm 
          onRegisterSuccess={() => setVistaPublica('login')} 
          onGoToLogin={() => setVistaPublica('login')} 
        />
      )}
    </div>
  );
}

// Exportamos el componente App por defecto para que pueda ser utilizado en main.tsx
export default App;