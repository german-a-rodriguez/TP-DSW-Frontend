import { useEffect, useState } from 'react';
import type { Membresia } from '../models/Membresia';
import type { Plan } from '../models/Plan';
import type { Rutina } from '../models/Rutina';
import { obtenerMembresias } from '../services/membresiaService';
import { obtenerPlanes } from '../services/planService';
import { obtenerRutinas } from '../services/rutinaService';
import { obtenerUsuarioLogueado } from '../utils/auth';

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
    <div className="dashboard-cliente">
      <header className="dashboard-encabezado">
        <h1>Panel de Control</h1>
        <p>Bienvenido de vuelta, {usuario?.nombre || 'Cliente'}.</p>
      </header>

      {cargando && <p role="status">Cargando resumen...</p>}
      {error && <div className="mensaje-error" role="alert">{error}</div>}

      <div className="dashboard-fila-superior">
        {/* Tarjeta de Estado de Membresía */}
        {!cargando && !error && (
          <section className="dashboard-tarjeta-membresia">
            <div className="dashboard-titulo-icono">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h2>Estado de Membresía</h2>
            </div>

            <div className="dashboard-membresia-cuerpo">
              <div>
                {membresiaPrincipal ? (
                  <>
                    <div className="dashboard-plan-linea">
                      <span className="dashboard-plan-nombre">
                        {obtenerNombrePlan(membresiaPrincipal.plan)}
                      </span>
                      <span
                        className={`etiqueta-estado estado-${membresiaPrincipal.estadoMembresia}`}
                      >
                        {membresiaPrincipal.estadoMembresia.toUpperCase()}
                      </span>
                    </div>
                    <p className="dashboard-vencimiento">
                      Vence el {formatearFecha(membresiaPrincipal.fechaFin)}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="dashboard-plan-linea">
                      <span className="dashboard-plan-nombre">Sin Membresía</span>
                    </div>
                    <p className="dashboard-vencimiento">
                      Contratá un plan para habilitar todas las funciones.
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => onIrASeccion('membresias')}
                className="btn-historial"
              >
                Ver Historial
              </button>
            </div>
          </section>
        )}

        {/* Tarjeta de Atajos */}
        <section className="dashboard-tarjeta-atajos">
          <h3>Atajos</h3>
          <div className="dashboard-atajos-grilla">
            <button
              type="button"
              onClick={() => onIrASeccion('clases')}
              className="boton-atajo"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Ver Clases</span>
            </button>

            <button
              type="button"
              onClick={() => onIrASeccion('solicitarRutina')}
              className="boton-atajo"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" />
              </svg>
              <span>Pedir Rutina</span>
            </button>
          </div>
        </section>
      </div>

      {/* Sección inferior: Tus Rutinas Recientes */}
      {!cargando && !error && (
        <section className="dashboard-rutinas-seccion">
          <div className="dashboard-rutinas-encabezado">
            <div className="dashboard-titulo-icono">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <h2>Tus Rutinas Recientes</h2>
            </div>

            <button
              type="button"
              onClick={() => onIrASeccion('misRutinas')}
              className="acceso-enlace"
            >
              Ver todas
            </button>
          </div>

          {rutinas.length === 0 ? (
            <div className="dashboard-rutinas-vacio">
              <div className="icono-vacio-circulo">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.5 6.5l11 11" />
                  <path d="M21 21l-1-1" />
                  <path d="M3 3l1 1" />
                  <path d="M18 22l4-4" />
                  <path d="M2 6l4-4" />
                  <path d="M3 10l7-7" />
                  <path d="M14 21l7-7" />
                </svg>
              </div>
              <h3>No tienes rutinas asignadas</h3>
              <p>
                Solicita una rutina personalizada a nuestros entrenadores para empezar a
                entrenar.
              </p>
              <button
                type="button"
                onClick={() => onIrASeccion('solicitarRutina')}
                className="btn btn-lima"
              >
                Solicitar Rutina
              </button>
            </div>
          ) : (
            <div className="dashboard-rutinas-lista">
              {rutinas.map((rutina) => (
                <article key={rutina.id} className="tarjeta dashboard-rutina-item">
                  <div className="dashboard-rutina-cabecera">
                    <h3>{rutina.nombre}</h3>
                    <span className={`etiqueta-estado estado-${rutina.estado}`}>
                      {rutina.estado.toUpperCase()}
                    </span>
                  </div>
                  <p>{rutina.descripcion}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
