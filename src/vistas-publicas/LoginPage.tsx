import { useState } from 'react';
import { loginUsuario } from '../services/authService';
import { parseJwt } from '../utils/auth';

interface LoginPageProps {
  avisoSesion?: string;
  onLoginSuccess: (token: string, rol: string) => void;
  onGoToRegister: () => void;
}

export function LoginPage({ avisoSesion, onLoginSuccess, onGoToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (evento: React.SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setError('');

    try {
      // El backend devuelve el token a través del servicio
      const token = await loginUsuario(email, contrasenia);

      // Decodificamos el token para extraer el rol
      const decodedToken = parseJwt(token);
      const rol = decodedToken?.rol;
      if (!rol) throw new Error('La respuesta de inicio de sesión no contiene un usuario válido.');

      // Guardamos en el localStorage del navegador para que no se pierda si recarga la página
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);

      // Notificamos a App.tsx
      onLoginSuccess(token, rol);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <main className="acceso-pagina">
      <div className="acceso-contenido">
        <div className="marca-gym acceso-marca">
          <div>
            <span>NEXUS</span> GYM
          </div>
        </div>

        <section className="acceso-tarjeta" aria-labelledby="login-titulo">
          <div className="acceso-encabezado">
            <h1 id="login-titulo">Iniciar Sesión</h1>
            <p>Ingresá tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="acceso-formulario">
            {avisoSesion && (
              <div className="mensaje-error" role="status">
                {avisoSesion}
              </div>
            )}
            {error && (
              <div className="mensaje-error" role="alert">
                {error}
              </div>
            )}

            <div className="campo-form">
              <label htmlFor="login-email">Correo electrónico</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="campo-form">
              <label htmlFor="login-contrasenia">Contraseña</label>
              <input
                id="login-contrasenia"
                type="password"
                autoComplete="current-password"
                value={contrasenia}
                onChange={(evento) => setContrasenia(evento.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-lima">
              Ingresar
            </button>
          </form>

          <div className="acceso-pie">
            ¿No tenés cuenta?{' '}
            <button
              type="button"
              onClick={onGoToRegister}
              className="acceso-enlace"
            >
              Registrate
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
