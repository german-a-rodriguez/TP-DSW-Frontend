import { useEffect, useState } from 'react';
import type { Rutina } from '../../models/Rutina';
import type { Solicitud } from '../../models/Solicitud';
import type { Usuario } from '../../models/Usuario';
import {
  obtenerRutinas,
  crearRutina,
  modificarRutina,
  eliminarRutina,
} from '../../services/rutinaService';
import { obtenerSolicitudes } from '../../services/solicitudService';
import { obtenerUsuarios } from '../../services/usuarioService';
import { obtenerUsuarioLogueado } from '../../utils/auth';

interface RutinasCrudProps {
  solicitudPreseleccionadaId?: number | null;
}

export function RutinasCrud({ solicitudPreseleccionadaId }: RutinasCrudProps) {
  const usuarioLogueado = obtenerUsuarioLogueado();

  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [entrenadores, setEntrenadores] = useState<Usuario[]>([]);

  const [solicitudId, setSolicitudId] = useState(
    solicitudPreseleccionadaId ? String(solicitudPreseleccionadaId) : ''
  );
  const [entrenadorId, setEntrenadorId] = useState(
    usuarioLogueado?.rol === 'entrenador' ? String(usuarioLogueado.id) : ''
  );
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<'activa' | 'inactiva'>('activa');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = async () => {
    try {
      const [listaR, listaS, listaU] = await Promise.all([
        obtenerRutinas(),
        obtenerSolicitudes(),
        obtenerUsuarios(),
      ]);
      setRutinas(listaR);
      setSolicitudes(listaS);
      setEntrenadores(listaU.filter((u) => u.rol === 'entrenador'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarDatos();
    };
    iniciar();
  }, []);

  const limpiarFormulario = () => {
    setSolicitudId('');
    setNombre('');
    setDescripcion('');
    setEstado('activa');
    setEditandoId(null);
    if (usuarioLogueado?.rol === 'entrenador') {
      setEntrenadorId(String(usuarioLogueado.id));
    } else {
      setEntrenadorId('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      if (editandoId) {
        await modificarRutina(editandoId, {
          nombre,
          descripcion,
          estado,
        });
        setMensaje('Rutina actualizada correctamente');
      } else {
        await crearRutina({
          nombre,
          descripcion,
          estado,
          solicitudId: Number(solicitudId),
          entrenadorId: Number(entrenadorId),
        });
        setMensaje('¡Rutina creada y asignada al cliente con éxito! ');
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const seleccionarParaEditar = (r: Rutina) => {
    setError('');
    setMensaje('');
    setEditandoId(r.id);
    setNombre(r.nombre);
    setDescripcion(r.descripcion);
    setEstado(r.estado);
    const idSol = typeof r.solicitud === 'object' ? r.solicitud.id : r.solicitud;
    const idEnt = typeof r.entrenador === 'object' ? r.entrenador.id : r.entrenador;
    setSolicitudId(String(idSol));
    setEntrenadorId(String(idEnt));
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta rutina?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarRutina(id);
      setMensaje('Rutina eliminada');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const obtenerTextoSolicitud = (solRel: Solicitud | number) => {
    const id = typeof solRel === 'object' ? solRel.id : solRel;
    const sol = solicitudes.find((s) => s.id === id);
    if (sol) {
      return `Solicitud #${sol.id} - ${sol.cliente?.nombre} ${sol.cliente?.apellido} (${sol.objetivo})`;
    }
    return `Solicitud #${id}`;
  };

  return (
    <div>
      <h2>Rutinas</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>
            {editandoId
              ? `Editando Rutina #${editandoId}`
              : 'Asignar Nueva Rutina a Solicitud de Cliente'}
          </h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Solicitud del Cliente:</label>
              <select
                value={solicitudId}
                onChange={(e) => setSolicitudId(e.target.value)}
                required
                disabled={editandoId !== null}
              >
                <option value="">-- Seleccionar Solicitud Pendiente --</option>
                {solicitudes
                  .filter(
                    (s) =>
                      s.estado === 'pendiente' ||
                      (editandoId !== null && String(s.id) === solicitudId)
                  )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} - {s.cliente?.nombre} {s.cliente?.apellido} | Objetivo: {s.objetivo}
                    </option>
                  ))}
              </select>
            </div>

            <div className="campo-form">
              <label>Entrenador que asigna:</label>
              <select
                value={entrenadorId}
                onChange={(e) => setEntrenadorId(e.target.value)}
                required
                disabled={editandoId !== null || usuarioLogueado?.rol === 'entrenador'}
              >
                <option value="">-- Seleccionar Entrenador --</option>
                {entrenadores.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.nombre} {ent.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-form">
              <label>Nombre de la Rutina:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: Rutina Hipertrofia 4 días"
              />
            </div>

            <div className="campo-form">
              <label>Estado:</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as 'activa' | 'inactiva')}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>

          <div className="campo-form" style={{ marginBottom: '12px' }}>
            <label>Descripción / Plan de ejercicios detallado:</label>
            <textarea
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              placeholder="Ej: Día 1: Pecho y Tríceps (Press banca 4x10, Fondos 3x12). Día 2: Espalda y Bíceps..."
            />
          </div>

          <div className="acciones-celda">
            <button type="submit" className="btn btn-azul">
              {editandoId ? 'Guardar Cambios' : 'Crear y Asignar Rutina'}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarFormulario} className="btn btn-gris">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="tarjeta">
        <h3>Rutinas Creadas y Asignadas</h3>
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cliente / Solicitud</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rutinas.length === 0 ? (
              <tr>
                <td colSpan={6}>No hay rutinas cargadas todavía.</td>
              </tr>
            ) : (
              rutinas.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nombre}</td>
                  <td>{obtenerTextoSolicitud(r.solicitud)}</td>
                  <td>{r.descripcion}</td>
                  <td>{r.estado}</td>
                  <td className="acciones-celda">
                    <button onClick={() => seleccionarParaEditar(r)} className="btn btn-azul">
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(r.id)} className="btn btn-rojo">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
