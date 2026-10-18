export function AdminMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Administración ⚙️</h1>
      <p>Bienvenido, Administrador. Aquí puedes gestionar usuarios, disciplinas y planes.</p>
      <button onClick={onLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Cerrar Sesión</button>
    </div>
  );
}