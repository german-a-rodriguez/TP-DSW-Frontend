import { useState } from 'react';
import { DashboardCliente } from './DashboardCliente';
import { SolicitarRutinaForm } from './SolicitarRutinaForm';
import { ClasesFiltradasList } from './ClasesFiltradasList';
import { MembresiasPage } from './MembresiasPage';
import { MisRutinasList } from './MisRutinasList';
import { obtenerUsuarioLogueado } from '../../utils/auth';

export function ClientePage({ onLogout }: { onLogout: () => void }) {
  const usuario = obtenerUsuarioLogueado();

  const [seccion, setSeccion] = useState<
    'dashboard' | 'solicitarRutina' | 'misRutinas' | 'membresias' | 'clases'
  >('dashboard');

  return (
    <div className="contenedor-panel">
      <header className="encabezado-panel">
        <h1>Tablero del cliente</h1>
        <p>{usuario?.nombre} {usuario?.apellido}</p>
        <button onClick={onLogout} className="btn btn-rojo">Cerrar sesión</button>
      </header>
      <nav className="barra-navegacion" aria-label="Secciones del panel">
        <button
          onClick={() => setSeccion('dashboard')}
          className={
            seccion === 'dashboard' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Resumen</span>
        </button>

        <button
          onClick={() => setSeccion('solicitarRutina')}
          className={
            seccion === 'solicitarRutina'
              ? 'btn btn-azul'
              : 'btn btn-gris'
          }
        >
          <span>Solicitar rutina</span>
        </button>

        <button
          onClick={() => setSeccion('misRutinas')}
          className={
            seccion === 'misRutinas' ? 'btn btn-azul' : 'btn btn-gris'
          }
        >
          <span>Mis rutinas</span>
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
      </nav>
      <main>
        {seccion === 'dashboard' && <DashboardCliente onIrASeccion={setSeccion} />}
        {seccion === 'solicitarRutina' && <SolicitarRutinaForm />}
        {seccion === 'misRutinas' && <MisRutinasList />}
        {seccion === 'membresias' && <MembresiasPage />}
        {seccion === 'clases' && <ClasesFiltradasList />}
      </main>
    </div>
  );
}
