export function ClienteMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Tablero del Cliente 🏋️‍♂️</h1>
      <p>Bienvenido. Aquí puedes ver tus rutinas, solicitar planes y ver tus clases.</p>
      <button onClick={onLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Cerrar Sesión</button>
    </div>
  );
}