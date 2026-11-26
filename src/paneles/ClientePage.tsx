import { useState } from 'react';
import { DashboardCliente } from './DashboardCliente';
import { SolicitarRutinaForm } from '../secciones/solicitudes/SolicitarRutinaForm';
import { ClasesFiltradasList } from '../secciones/clases/ClasesFiltradasList';
import { MembresiasPage } from '../secciones/membresias/MembresiasPage';
import { MisRutinasList } from '../secciones/rutinas/MisRutinasList';
import { obtenerUsuarioLogueado } from '../utils/auth';

export function ClientePage({ onLogout }: { onLogout: () => void }) {
  const usuario = obtenerUsuarioLogueado();

  const [seccion, setSeccion] = useState<
    'dashboard' | 'solicitarRutina' | 'misRutinas' | 'membresias' | 'clases'
  >('dashboard');

  return (
    <div className="layout-panel">
      <aside className="barra-lateral">
        <div className="barra-lateral-superior">
          <div className="marca-gym marca-lateral">
            <div>
              <span>NEXUS</span>GYM
            </div>
          </div>

          <nav className="menu-lateral" aria-label="Secciones del panel">
            <button
              onClick={() => setSeccion('dashboard')}
              className={
                seccion === 'dashboard' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setSeccion('solicitarRutina')}
              className={
                seccion === 'solicitarRutina'
                  ? 'boton-menu-lateral activo'
                  : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              <span>Solicitar rutina</span>
            </button>

            <button
              onClick={() => setSeccion('misRutinas')}
              className={
                seccion === 'misRutinas' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span>Mis rutinas</span>
            </button>

            <button
              onClick={() => setSeccion('membresias')}
              className={
                seccion === 'membresias' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Membresías</span>
            </button>

            <button
              onClick={() => setSeccion('clases')}
              className={
                seccion === 'clases' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Clases</span>
            </button>
          </nav>
        </div>

        <div className="pie-lateral">
          <div className="usuario-lateral">
            <div className="avatar-lateral">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="datos-usuario-lateral">
              <strong>
                {usuario?.nombre} {usuario?.apellido}
              </strong>
              <span>CLIENTE</span>
            </div>
          </div>

          <button onClick={onLogout} className="boton-cerrar-sesion">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="contenido-panel">
        {seccion === 'dashboard' && <DashboardCliente onIrASeccion={setSeccion} />}
        {seccion === 'solicitarRutina' && <SolicitarRutinaForm />}
        {seccion === 'misRutinas' && <MisRutinasList />}
        {seccion === 'membresias' && <MembresiasPage />}
        {seccion === 'clases' && <ClasesFiltradasList />}
      </main>
    </div>
  );
}
