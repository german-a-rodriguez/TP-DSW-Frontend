import { useEffect, useState } from 'react';
import type { Solicitud } from '../../models/Solicitud';
import {
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  modificarSolicitud,
  eliminarSolicitud,
} from '../../services/solicitudService';
import { obtenerUsuarioLogueado } from '../../utils/auth';

interface SolicitudesListProps {
  onIrACrearRutina?: (solicitudId: number) => void;
}

export function SolicitudesList({ onIrACrearRutina }: SolicitudesListProps) {
  const usuarioLogueado = obtenerUsuarioLogueado();
  const puedeEliminarSolicitud =
    usuarioLogueado?.rol === 'admin' || usuarioLogueado?.rol === 'cliente';
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('');

  const [solicitudDetalle, setSolicitudDetalle] = useState<Solicitud | null>(null);
  const [peso, setPeso] = useState('');
  const [masaMuscular, setMasaMuscular] = useState('');
  const [altura, setAltura] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [lesionesPrevias, setLesionesPrevias] = useState('');
  const [estado, setEstado] = useState<'pendiente' | 'aprobada' | 'rechazada'>('pendiente');

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarSolicitudes = async (estadoElegido: string) => {
    try {
      const lista = await obtenerSolicitudes(estadoElegido);
      setSolicitudes(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarSolicitudes(filtroEstado);
    };
    iniciar();
  }, [filtroEstado]);

  const cargarDetalleSolicitud = async (id: number) => {
    try {
      const s = await obtenerSolicitudPorId(id);
      setSolicitudDetalle(s);
      setPeso(String(s.peso));
      setMasaMuscular(String(s.masaMuscular));
      setAltura(String(s.altura));
      setObjetivo(s.objetivo);
      setLesionesPrevias(s.lesionesPrevias || '');
      setEstado(s.estado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const verDetalleSolicitud = (id: number) => {
    setError('');
    setMensaje('');
    cargarDetalleSolicitud(id);
  };

  const handleGuardarDetalle = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!solicitudDetalle) return;
    setError('');
    setMensaje('');

    try {
      await modificarSolicitud(solicitudDetalle.id, {
        peso: Number(peso),
        masaMuscular: Number(masaMuscular),
        altura: Number(altura),
        objetivo,
        lesionesPrevias: lesionesPrevias.trim() === '' ? null : lesionesPrevias,
        estado,
      });

      setMensaje('Solicitud actualizada correctamente');
      await cargarSolicitudes(filtroEstado);
      await cargarDetalleSolicitud(solicitudDetalle.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const handleEliminarSolicitud = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta solicitud?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarSolicitud(id);
      setMensaje('Solicitud eliminada');
      setSolicitudDetalle(null);
      await cargarSolicitudes(filtroEstado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  return (
    <div>
      <h2>Solicitudes de rutina</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <div className="tarjeta">
        <div className="campo-form" style={{ maxWidth: '300px' }}>
          <label>Filtrar por Estado:</label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>

        <table className="tabla-crud">
          <thead>
            <tr>
              <th>Nombre del Cliente</th>
              <th>Objetivo</th>
              <th>Fecha de Solicitud</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan={5}>No se encontraron solicitudes para este filtro.</td>
              </tr>
            ) : (
              solicitudes.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.cliente?.nombre} {s.cliente?.apellido}
                  </td>
                  <td>{s.objetivo}</td>
                  <td>{s.fechaSolicitud ? s.fechaSolicitud.slice(0, 10) : '-'}</td>
                  <td>{s.estado}</td>
                  <td className="acciones-celda">
                    <button onClick={() => verDetalleSolicitud(s.id)} className="btn btn-azul">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {solicitudDetalle && (
        <div className="tarjeta">
          <h3>
            Detalle de la Solicitud #{solicitudDetalle.id} - Cliente:{' '}
            {solicitudDetalle.cliente?.nombre} {solicitudDetalle.cliente?.apellido} (
            {solicitudDetalle.cliente?.email})
          </h3>
          <p>
            <strong>Fecha de Solicitud:</strong>{' '}
            {solicitudDetalle.fechaSolicitud?.slice(0, 10)}
          </p>

          <form onSubmit={handleGuardarDetalle}>
            <div className="campos-formulario">
              <div className="grilla-form">
                <div className="campo-form">
                  <label>Peso (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-form">
                  <label>Masa Muscular (kg o %):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={masaMuscular}
                    onChange={(e) => setMasaMuscular(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-form">
                  <label>Altura (cm o m):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-form">
                  <label>Estado:</label>
                  <select
                    value={estado}
                    onChange={(e) =>
                      setEstado(e.target.value as 'pendiente' | 'aprobada' | 'rechazada')
                    }
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobada">Aprobada</option>
                    <option value="rechazada">Rechazada</option>
                  </select>
                </div>

                <div className="campo-form">
                  <label>Objetivo:</label>
                  <input
                    type="text"
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-form">
                  <label>Lesiones Previas:</label>
                  <input
                    type="text"
                    value={lesionesPrevias}
                    onChange={(e) => setLesionesPrevias(e.target.value)}
                    placeholder="Ninguna"
                  />
                </div>
              </div>

              <div className="acciones-celda">
                <button type="submit" className="btn btn-azul">
                  Guardar cambios
                </button>

                {onIrACrearRutina && solicitudDetalle.estado === 'pendiente' && (
                  <button
                    type="button"
                    onClick={() => onIrACrearRutina(solicitudDetalle.id)}
                    className="btn btn-verde"
                  >
                    Asignar rutina
                  </button>
                )}

                {puedeEliminarSolicitud && (
                  <button
                    type="button"
                    onClick={() => handleEliminarSolicitud(solicitudDetalle.id)}
                    className="btn btn-rojo"
                  >
                    Eliminar Solicitud
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSolicitudDetalle(null)}
                  className="btn btn-gris"
                >
                  Cerrar Detalle
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
