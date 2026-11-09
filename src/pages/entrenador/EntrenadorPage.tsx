import { useState } from 'react';
import { SolicitudesList } from './SolicitudesList';
import { RutinasCrud } from './RutinasCrud';
import { ClasesCrud } from '../admin/ClasesCrud';
import { obtenerUsuarioLogueado } from '../../utils/auth';

export function EntrenadorPage({ onLogout }: { onLogout: () => void }) {
  const usuario = obtenerUsuarioLogueado();

  const [seccion, setSeccion] = useState<'solicitudes' | 'rutinas' | 'crudClases'>('solicitudes');

  const [solicitudElegidaId, setSolicitudElegidaId] = useState<number | null>(null);

  return (
    <div className="contenedor-panel">
      <header className="encabezado-panel">
        <h1>Tablero del entrenador</h1>
        <p>{usuario?.nombre} {usuario?.apellido}</p>
        <button onClick={onLogout} className="btn btn-rojo">Cerrar sesión</button>
      </header>
      <nav className="barra-navegacion" aria-label="Secciones del panel">
        <button
          onClick={() => setSeccion('solicitudes')}
          className={
            seccion === 'solicitudes' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Solicitudes de rutina</span>
        </button>

        <button
          onClick={() => setSeccion('rutinas')}
          className={
            seccion === 'rutinas' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Rutinas</span>
        </button>

        <button
          onClick={() => setSeccion('crudClases')}
          className={
            seccion === 'crudClases' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Administrar clases</span>
        </button>
      </nav>
      <main>
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
        {seccion === 'crudClases' && <ClasesCrud />}
      </main>
    </div>
  );
}
