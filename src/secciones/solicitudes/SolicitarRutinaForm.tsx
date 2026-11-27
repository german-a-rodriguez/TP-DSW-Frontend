import { useEffect, useState } from 'react';
import { ListadoCrud } from '../../components/ListadoCrud';
import type { Solicitud } from '../../models/Solicitud';
import { crearSolicitud, obtenerSolicitudesPorCliente } from '../../services/solicitudService';
import { obtenerUsuarioLogueado } from '../../utils/auth';

export function SolicitarRutinaForm() {
  const [peso, setPeso] = useState('');
  const [masaMuscular, setMasaMuscular] = useState('');
  const [altura, setAltura] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [lesionesPrevias, setLesionesPrevias] = useState('');
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarSolicitudes = async () => {
    const usuario = obtenerUsuarioLogueado();
    if (!usuario) return;

    try {
      const lista = await obtenerSolicitudesPorCliente(usuario.id);
      const propias = Array.isArray(lista)
        ? lista.filter((s) => s.cliente?.id === usuario.id)
        : [];
      setSolicitudes(propias);
    } catch {
      // Si el backend restringe GET /api/solicitudes a admin/entrenador, no bloqueamos el alta del cliente
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarSolicitudes();
    };
    iniciar();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setMensaje('');

    const usuario = obtenerUsuarioLogueado();
    if (!usuario) {
      setError('No se encontró la sesión del usuario.');
      return;
    }

    try {
      await crearSolicitud({
        clienteId: usuario.id,
        peso: Number(peso),
        masaMuscular: Number(masaMuscular),
        altura: Number(altura),
        objetivo,
        lesionesPrevias: lesionesPrevias.trim() === '' ? null : lesionesPrevias,
      });
      setMensaje('¡Solicitud enviada! Un entrenador la revisará pronto.');
      setPeso('');
      setMasaMuscular('');
      setAltura('');
      setObjetivo('');
      setLesionesPrevias('');
      await cargarSolicitudes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo enviar la solicitud.',
      );
    }
  };

  return (
    <div>
      <h2>Solicitar rutina</h2>
      <p>
        Necesitás una membresía activa. Podés contratarla desde la sección
        Membresías.
      </p>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>Completá tus datos físicos y tu objetivo</h3>
          <div className="grilla-form">
            <div className="campo-form">
              <label>Peso actual (kg):</label>
              <input
                type="number"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                required
                placeholder="Ej: 75.5"
              />
            </div>
            <div className="campo-form">
              <label>Masa muscular (kg o %):</label>
              <input
                type="number"
                step="0.1"
                value={masaMuscular}
                onChange={(e) => setMasaMuscular(e.target.value)}
                required
                placeholder="Ej: 35"
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
                placeholder="Ej: 175"
              />
            </div>
            <div className="campo-form">
              <label>Objetivo principal:</label>
              <input
                type="text"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                required
                placeholder="Ej: Ganar masa muscular y fuerza"
              />
            </div>
          </div>
          <div className="campo-form">
            <label>
              Lesiones previas o consideraciones médicas (opcional):
            </label>
            <textarea
              rows={3}
              value={lesionesPrevias}
              onChange={(e) => setLesionesPrevias(e.target.value)}
              placeholder="Ej: Molestia leve en hombro derecho"
            />
          </div>
          <button type="submit" className="btn btn-lima">
            Enviar solicitud
          </button>
        </div>
      </form>

      <ListadoCrud titulo="Mis solicitudes de rutina">
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Objetivo</th>
              <th>Peso / Altura / Masa</th>
              <th>Lesiones previas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay solicitudes registradas.</td>
              </tr>
            ) : (
              solicitudes.map((s) => (
                <tr key={s.id}>
                  <td>{s.fechaSolicitud ? s.fechaSolicitud.slice(0, 10) : '-'}</td>
                  <td className="listado-nombre">{s.objetivo}</td>
                  <td>
                    {s.peso} kg · {s.altura} · {s.masaMuscular}
                  </td>
                  <td>{s.lesionesPrevias || 'Ninguna'}</td>
                  <td>
                    <span className={`etiqueta-estado estado-${s.estado}`}>
                      {s.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ListadoCrud>
    </div>
  );
}