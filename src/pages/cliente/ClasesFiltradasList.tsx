import { useEffect, useState } from 'react';
import type { Clase } from '../../models/Clase';
import type { Disciplina } from '../../models/Disciplina';
import {
  obtenerClases,
  obtenerClasePorId,
  modificarClase,
  eliminarClase,
} from '../../services/claseService';
import { obtenerDisciplinas } from '../../services/disciplinaService';
import { obtenerUsuarioLogueado } from '../../utils/auth';

export function ClasesFiltradasList() {
  const usuarioLogueado = obtenerUsuarioLogueado();
  const puedeEditarClase =
    usuarioLogueado?.rol === 'admin' || usuarioLogueado?.rol === 'entrenador';

  const [clases, setClases] = useState<Clase[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [filtroDisciplinaId, setFiltroDisciplinaId] = useState('');

  const [claseDetalle, setClaseDetalle] = useState<Clase | null>(null);
  const [diaSemana, setDiaSemana] = useState('lunes');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [cupos, setCupos] = useState('');
  const [disciplinaId, setDisciplinaId] = useState('');
  const [entrenadorId, setEntrenadorId] = useState('');

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const listaD = await obtenerDisciplinas();
        setDisciplinas(listaD);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las disciplinas.');
      }
    };
    cargar();
  }, []);

  const cargarClases = async (idDisciplina: string) => {
    try {
      const listaC = await obtenerClases(idDisciplina);
      setClases(listaC);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarClases(filtroDisciplinaId);
    };
    iniciar();
  }, [filtroDisciplinaId]);

  const cargarDetalleClase = async (id: number) => {
    try {
      const c = await obtenerClasePorId(id);
      setClaseDetalle(c);
      setDiaSemana(c.diaSemana);
      setHoraInicio(c.horaInicio);
      setHoraFin(c.horaFin);
      setCupos(String(c.cupos));
      setDisciplinaId(String(c.disciplina.id));
      setEntrenadorId(String(c.entrenador.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const verDetalleClase = (id: number) => {
    setError('');
    setMensaje('');
    cargarDetalleClase(id);
  };

  const handleGuardarDetalle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claseDetalle) return;
    setError('');
    setMensaje('');

    try {
      await modificarClase(claseDetalle.id, {
        diaSemana,
        horaInicio,
        horaFin,
        cupos: Number(cupos),
        disciplinaId: Number(disciplinaId),
        entrenadorId: Number(entrenadorId),
      });

      setMensaje('Clase actualizada correctamente');
      await cargarClases(filtroDisciplinaId);
      await cargarDetalleClase(claseDetalle.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const handleEliminarClase = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta clase?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarClase(id);
      setMensaje('Clase eliminada');
      setClaseDetalle(null);
      await cargarClases(filtroDisciplinaId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  return (
    <div>
      <h2>Clases por disciplina</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <div className="tarjeta">
        <div className="campo-form" style={{ maxWidth: '320px' }}>
          <label>Filtrar por Disciplina:</label>
          <select
            value={filtroDisciplinaId}
            onChange={(e) => setFiltroDisciplinaId(e.target.value)}
          >
            <option value="">Todas las disciplinas</option>
            {disciplinas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <table className="tabla-crud">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Nombre del Entrenador</th>
              <th>Disponibilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.length === 0 ? (
              <tr>
                <td colSpan={6}>No hay clases para la disciplina seleccionada.</td>
              </tr>
            ) : (
              clases.map((c) => (
                <tr key={c.id}>
                  <td>{c.disciplina?.nombre}</td>
                  <td style={{ textTransform: 'capitalize' }}>{c.diaSemana}</td>
                  <td>
                    {c.horaInicio} a {c.horaFin} hs
                  </td>
                  <td>
                    {c.entrenador?.nombre} {c.entrenador?.apellido}
                  </td>
                  <td>
                    {c.cuposDisponibles ?? c.cupos} disponibles de {c.cupos}
                  </td>
                  <td className="acciones-celda">
                    <button onClick={() => verDetalleClase(c.id)} className="btn btn-azul">
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {claseDetalle && (
        <div className="tarjeta">
          <h3>Detalle de la Clase #{claseDetalle.id}</h3>
          <p>
            <strong>Disciplina:</strong> {claseDetalle.disciplina?.nombre}
          </p>
          <p>
            <strong>Entrenador:</strong> {claseDetalle.entrenador?.nombre}{' '}
            {claseDetalle.entrenador?.apellido}
          </p>
          <p>
            <strong>Día y Horario:</strong> {claseDetalle.diaSemana} de {claseDetalle.horaInicio}{' '}
            a {claseDetalle.horaFin} hs
          </p>
          <p>
            <strong>Disponibilidad:</strong> {claseDetalle.cuposDisponibles ?? claseDetalle.cupos}{' '}
            cupos libres de {claseDetalle.cupos} totales
          </p>

          {puedeEditarClase ? (
            <form onSubmit={handleGuardarDetalle} style={{ marginTop: '15px' }}>
              <div className="campos-formulario">
                <h4>Editar clase</h4>
                <div className="grilla-form">
                  <div className="campo-form">
                    <label>Día de la Semana:</label>
                    <select value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)}>
                      <option value="lunes">Lunes</option>
                      <option value="martes">Martes</option>
                      <option value="miercoles">Miércoles</option>
                      <option value="jueves">Jueves</option>
                      <option value="viernes">Viernes</option>
                      <option value="sabado">Sábado</option>
                      <option value="domingo">Domingo</option>
                    </select>
                  </div>

                  <div className="campo-form">
                    <label>Hora Inicio:</label>
                    <input
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      required
                    />
                  </div>

                  <div className="campo-form">
                    <label>Hora Fin:</label>
                    <input
                      type="time"
                      value={horaFin}
                      onChange={(e) => setHoraFin(e.target.value)}
                      required
                    />
                  </div>

                  <div className="campo-form">
                    <label>Cupos Totales:</label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={cupos}
                      onChange={(e) => setCupos(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="acciones-celda">
                  <button type="submit" className="btn btn-azul">
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminarClase(claseDetalle.id)}
                    className="btn btn-rojo"
                  >
                    Eliminar Clase
                  </button>
                  <button
                    type="button"
                    onClick={() => setClaseDetalle(null)}
                    className="btn btn-gris"
                  >
                    Cerrar Detalle
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button onClick={() => setClaseDetalle(null)} className="btn btn-gris">
              Cerrar Detalle
            </button>
          )}
        </div>
      )}
    </div>
  );
}
