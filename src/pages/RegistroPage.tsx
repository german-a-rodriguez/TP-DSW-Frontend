import { useState } from 'react';
import { registrarCliente } from '../services/authService';

interface RegistroPageProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export function RegistroPage({
  onRegisterSuccess,
  onGoToLogin,
}: RegistroPageProps) {
  // Estados para cada campo que pide el backend en el autoregistro
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');

  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const handleAutorregistroSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError('');
    setMensajeExito('');

    try {
      // Petición al endpoint de registro
      await registrarCliente({
        nombre,
        apellido,
        email,
        contrasenia,
        telefono,
        fechaNacimiento,
        nombreUsuario,
      });

      setMensajeExito(
        '¡Usuario registrado con éxito! Redirigiendo al login...',
      );

      // Esperamos 2 segundos y volvemos al login automáticamente mediante el callback
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <main className="pagina-acceso">
      <div className="formulario-acceso">
        <section className="tarjeta" aria-labelledby="registro-titulo">
          <div className="encabezado-acceso">
            <h1 id="registro-titulo">Registrarse</h1>
            <p>Completá tus datos para crear una cuenta de cliente.</p>
          </div>

          <form
            onSubmit={handleAutorregistroSubmit}
            className="campos-formulario"
          >
            {error && (
              <div className="mensaje-error" role="alert">
                {error}
              </div>
            )}
            {mensajeExito && (
              <div className="mensaje-exito" role="status">
                {mensajeExito}
              </div>
            )}

            <div className="registro-fila">
              <div className="campo-form">
                <label htmlFor="registro-nombre">Nombre</label>
                <input
                  id="registro-nombre"
                  type="text"
                  autoComplete="given-name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="campo-form">
                <label htmlFor="registro-apellido">Apellido</label>
                <input
                  id="registro-apellido"
                  type="text"
                  autoComplete="family-name"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            <div className="campo-form">
              <label htmlFor="registro-usuario">Nombre de usuario</label>
              <input
                id="registro-usuario"
                type="text"
                autoComplete="username"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                placeholder="Elegí tu nombre de usuario"
                required
              />
            </div>

            <div className="campo-form">
              <label htmlFor="registro-email">Correo electrónico</label>
              <input
                id="registro-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="campo-form">
              <label htmlFor="registro-contrasenia">
                Contraseña (mín. 8 caracteres)
              </label>
              <input
                id="registro-contrasenia"
                type="password"
                autoComplete="new-password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="registro-fila">
              <div className="campo-form">
                <label htmlFor="registro-telefono">Teléfono (opcional)</label>
                <input
                  id="registro-telefono"
                  type="tel"
                  autoComplete="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Tu teléfono"
                />
              </div>
              <div className="campo-form">
                <label htmlFor="registro-nacimiento">Fecha de nacimiento</label>
                <input
                  id="registro-nacimiento"
                  type="date"
                  autoComplete="bday"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-verde">
              Crear cuenta
            </button>
          </form>

          <div className="pie-acceso">
            ¿Ya tenés cuenta?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="boton-enlace"
            >
              Iniciá sesión
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
