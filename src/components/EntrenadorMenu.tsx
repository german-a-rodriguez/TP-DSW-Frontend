export function EntrenadorMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Entrenador 📋</h1>
      <p>Bienvenido, Entrenador. Aquí puedes gestionar las solicitudes de rutinas de tus alumnos.</p>
      <button onClick={onLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Cerrar Sesión</button>
    </div>
  );
}