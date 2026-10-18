import { useState } from 'react';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export function AutorregistroForm({ onRegisterSuccess, onGoToLogin }: RegisterFormProps) {
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

  const handleAutorregistroSubmit = async (evento: React.SyntheticEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setError('');
    setMensajeExito('');

    try {
      // Petición al endpoint de registro
      const response = await fetch('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          contrasenia,
          telefono,
          fechaNacimiento,
          nombreUsuario,
          rol: 'cliente' // Por seguridad o consistencia con el backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      setMensajeExito('¡Usuario registrado con éxito! Redirigiendo al login...');
      
      // Esperamos 2 segundos y volvemos al login automáticamente mediante el callback
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);

    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: '400px', margin: '20px auto', textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3 className="form-title">Registro: Crear Cuenta</h3>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}

      <form onSubmit={handleAutorregistroSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
        </div>

        <div>
          <label>Apellido:</label>
          <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
        </div>

        <div>
          <label>Nombre de usuario:</label>
          <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
        </div>

        <div>
          <label>Contraseña:</label>
          <input type="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
        </div>

        <div>
          <label>Teléfono:</label>
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={{ width: '100%', padding: '6px' }} />
        </div>

        <div>
          <label>Fecha de Nacimiento:</label>
          <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
        </div>

        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          Registrarse
        </button>
      </form>

      {/* Botón para volver al login */}
      <div style={{ marginTop: '15px' }}>
        <button onClick={onGoToLogin} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
          ¿Ya tienes cuenta? Inicia sesión aquí
        </button>
      </div>
    </div>
  );
}