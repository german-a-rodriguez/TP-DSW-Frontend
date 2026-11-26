import { useState } from 'react';
import { UsuariosCrud } from '../secciones/usuarios/UsuariosCrud';
import { PlanesCrud } from '../secciones/planes/PlanesCrud';
import { DisciplinasCrud } from '../secciones/disciplinas/DisciplinasCrud';
import { MembresiasCrud } from '../secciones/membresias/MembresiasCrud';
import { ClasesCrud } from '../secciones/clases/ClasesCrud';
import { SolicitudesList } from '../secciones/solicitudes/SolicitudesList';
import { RutinasCrud } from '../secciones/rutinas/RutinasCrud';
import { obtenerUsuarioLogueado } from '../utils/auth';

export function AdminPage({ onLogout }: { onLogout: () => void }) {
  const usuario = obtenerUsuarioLogueado();

  const [seccion, setSeccion] = useState<
    | 'usuarios'
    | 'planes'
    | 'disciplinas'
    | 'membresias'
    | 'clases'
    | 'solicitudes'
    | 'rutinas'
  >('usuarios');

  const [solicitudElegidaId, setSolicitudElegidaId] = useState<number | null>(null);

  return (
    <div className="layout-panel panel-admin">
      <aside className="barra-lateral">
        <div className="barra-lateral-superior">
          <div className="marca-gym marca-lateral">
            <div>
              <span>NEXUS</span>GYM
            </div>
          </div>

          <nav className="menu-lateral" aria-label="Secciones del panel">
            <button
              onClick={() => setSeccion('usuarios')}
              className={
                seccion === 'usuarios' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Usuarios</span>
            </button>

            <button
              onClick={() => setSeccion('planes')}
              className={
                seccion === 'planes' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Planes</span>
            </button>

            <button
              onClick={() => setSeccion('disciplinas')}
              className={
                seccion === 'disciplinas' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Disciplinas</span>
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

            <button
              onClick={() => setSeccion('solicitudes')}
              className={
                seccion === 'solicitudes' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              <span>Solicitudes de rutina</span>
            </button>

            <button
              onClick={() => setSeccion('rutinas')}
              className={
                seccion === 'rutinas' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span>Rutinas</span>
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
              <span>ADMINISTRADOR</span>
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
        {seccion === 'usuarios' && <UsuariosCrud />}
        {seccion === 'planes' && <PlanesCrud />}
        {seccion === 'disciplinas' && <DisciplinasCrud />}
        {seccion === 'membresias' && <MembresiasCrud />}
        {seccion === 'clases' && <ClasesCrud />}
        {seccion === 'solicitudes' && (
          <SolicitudesList
            onIrACrearRutina={(idSolicitud) => {
              setSolicitudElegidaId(idSolicitud);
              setSeccion('rutinas');
            }}
          />
        )}
        {seccion === 'rutinas' && (
          <RutinasCrud
            key={solicitudElegidaId ?? 'nueva'}
            solicitudPreseleccionadaId={solicitudElegidaId}
          />
        )}
      </main>
    </div>
  );
}
