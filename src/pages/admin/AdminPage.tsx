import { useState } from 'react';
import { UsuariosCrud } from './UsuariosCrud';
import { PlanesCrud } from './PlanesCrud';
import { DisciplinasCrud } from './DisciplinasCrud';
import { MembresiasCrud } from './MembresiasCrud';
import { ClasesCrud } from './ClasesCrud';
import { SolicitudesList } from '../entrenador/SolicitudesList';
import { RutinasCrud } from '../entrenador/RutinasCrud';
import { obtenerUsuarioLogueado } from '../../utils/auth';

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
    <div className="contenedor-panel">
      <header className="encabezado-panel">
        <h1>Tablero del administrador</h1>
        <p>{usuario?.nombre} {usuario?.apellido}</p>
        <button onClick={onLogout} className="btn btn-rojo">Cerrar sesión</button>
      </header>
      <nav className="barra-navegacion" aria-label="Secciones del panel">
        <button
          onClick={() => setSeccion('usuarios')}
          className={
            seccion === 'usuarios' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Usuarios</span>
        </button>

        <button
          onClick={() => setSeccion('planes')}
          className={
            seccion === 'planes' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Planes</span>
        </button>

        <button
          onClick={() => setSeccion('disciplinas')}
          className={
            seccion === 'disciplinas' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Disciplinas</span>
        </button>

        <button
          onClick={() => setSeccion('membresias')}
          className={
            seccion === 'membresias' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Membresías</span>
        </button>

        <button
          onClick={() => setSeccion('clases')}
          className={
            seccion === 'clases' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Clases</span>
        </button>

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
      </nav>
      <main>
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
