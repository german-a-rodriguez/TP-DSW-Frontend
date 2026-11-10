import { useEffect, useState } from 'react';
import type { Membresia } from '../../models/Membresia';
import type { Plan } from '../../models/Plan';
import type { Rutina } from '../../models/Rutina';
import { obtenerMembresias } from '../../services/membresiaService';
import { obtenerPlanes } from '../../services/planService';
import { obtenerRutinas } from '../../services/rutinaService';
import { obtenerUsuarioLogueado } from '../../utils/auth';

type SeccionCliente = 'dashboard' | 'solicitarRutina' | 'misRutinas' | 'membresias' | 'clases';

interface DashboardClienteProps {
  onIrASeccion: (seccion: SeccionCliente) => void;
}

export function DashboardCliente({ onIrASeccion }: DashboardClienteProps) {
  const usuario = obtenerUsuarioLogueado();

  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        const [listaMembresias, listaPlanes, listaRutinas] = await Promise.all([
          obtenerMembresias(),
          obtenerPlanes(),
          obtenerRutinas(),
        ]);
        setMembresias(listaMembresias);
        setPlanes(listaPlanes);
        setRutinas(listaRutinas);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el resumen.');
      } finally {
        setCargando(false);
      }
    };
    cargarResumen();
  }, []);

  // Priorizamos la membresía activa; si no hay, tomamos la más reciente
  const membresiaPrincipal =
    membresias.find((m) => m.estadoMembresia === 'activa') ||
    membresias[membresias.length - 1] ||
    null;

  const obtenerNombrePlan = (plan: Plan | number) => {
    const id = typeof plan === 'number' ? plan : plan.id;
    return planes.find((p) => p.id === id)?.nombre || `Plan #${id}`;
  };

  const formatearFecha = (fechaIso: string) => {
    const fechaTexto = fechaIso.slice(0, 10);
    const partes = fechaTexto.split('-');
    if (partes.length !== 3) return fechaTexto;
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const anio = partes[0];
    const mesIndice = Number(partes[1]) - 1;
    const dia = partes[2];
    return `${dia} de ${meses[mesIndice] || partes[1]}, ${anio}`;
  };

  return (
    <div>
      <h2>Resumen del cliente</h2>
      <p>Bienvenido, {usuario?.nombre || 'Cliente'}.</p>
      {error && <div className="mensaje-error" role="alert">{error}</div>}
      {cargando && <p role="status">Cargando resumen...</p>}
      {!cargando && !error && (
        <>
          <section className="tarjeta">
            <h3>Estado de membresía</h3>
            {membresiaPrincipal ? (
              <>
                <p><strong>Plan:</strong> {obtenerNombrePlan(membresiaPrincipal.plan)}</p>
                <p><strong>Estado:</strong> {membresiaPrincipal.estadoMembresia}</p>
                <p><strong>Vencimiento:</strong> {formatearFecha(membresiaPrincipal.fechaFin)}</p>
              </>
            ) : <p>No tenés una membresía. Contratá un plan para comenzar.</p>}
            <button type="button" onClick={() => onIrASeccion('membresias')} className="btn btn-azul">
              Ver membresías
            </button>
          </section>
          <section className="tarjeta">
            <h3>Mis rutinas</h3>
            {rutinas.length === 0 ? <p>Todavía no tenés rutinas asignadas.</p> : (
              <ul>
                {rutinas.map((rutina) => <li key={rutina.id}>
                  <strong>{rutina.nombre}</strong> ({rutina.estado})
                  <p>{rutina.descripcion}</p>
                </li>)}
              </ul>
            )}
            <div className="acciones-celda">
              <button type="button" onClick={() => onIrASeccion('misRutinas')} className="btn btn-azul">Ver todas</button>
              <button type="button" onClick={() => onIrASeccion('solicitarRutina')} className="btn btn-verde">Solicitar rutina</button>
              <button type="button" onClick={() => onIrASeccion('clases')} className="btn btn-gris">Ver clases</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
