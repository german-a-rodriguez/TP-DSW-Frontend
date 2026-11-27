import { useState } from 'react';
import { SolicitudesList } from '../secciones/solicitudes/SolicitudesList';
import { RutinasCrud } from '../secciones/rutinas/RutinasCrud';
import { ClasesCrud } from '../secciones/clases/ClasesCrud';
import { CategoriasCrud } from '../secciones/categorias/CategoriasCrud';
import { EjerciciosCrud } from '../secciones/ejercicios/EjerciciosCrud';
import { obtenerUsuarioLogueado } from '../utils/auth';

export function EntrenadorPage({ onLogout }: { onLogout: () => void }) {
  const usuario = obtenerUsuarioLogueado();

  const [seccion, setSeccion] = useState<
    'solicitudes' | 'rutinas' | 'crudClases' | 'categorias' | 'ejercicios'
  >('solicitudes');

  const [solicitudElegidaId, setSolicitudElegidaId] = useState<number | null>(null);

  // Descomentar lo siguiente para probar error de renderizado en frontend:
  /*
  const [romperRender, setRomperRender] = useState(false);

  if (romperRender) {
    throw new Error('Prueba de ErrorBoundary en render');
  }
  */
  // Y agregar este botón donde casi termina el codigo: luego de la etiqueta </main> y antes de </div>
  /*  
      <button type="button" onClick={() => setRomperRender(true)} className="btn btn-rojo">
        Probar ErrorBoundary
      </button>
  */
  // Luego de presionarlo ver que se registro un error boundary en la db: log_errores y en el arhivo txt del log de errores.

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

            <button
              onClick={() => setSeccion('categorias')}
              className={
                seccion === 'categorias' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Categorías</span>
            </button>

            <button
              onClick={() => setSeccion('ejercicios')}
              className={
                seccion === 'ejercicios' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
              </svg>
              <span>Ejercicios</span>
            </button>

            <button
              onClick={() => setSeccion('crudClases')}
              className={
                seccion === 'crudClases' ? 'boton-menu-lateral activo' : 'boton-menu-lateral'
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Administrar clases</span>
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
              <span>ENTRENADOR</span>
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
        {seccion === 'categorias' && <CategoriasCrud />}
        {seccion === 'ejercicios' && <EjerciciosCrud />}
        {seccion === 'crudClases' && <ClasesCrud />}
      </main>
      


    </div>
  );
}
