import { useEffect, useState } from 'react';
import type { Clase } from '../../models/Clase';
import type { Disciplina } from '../../models/Disciplina';
import type { Usuario } from '../../models/Usuario';
import {
  obtenerClases,
  obtenerClasePorId,
  crearClase,
  modificarClase,
  eliminarClase,
} from '../../services/claseService';
import { obtenerDisciplinas } from '../../services/disciplinaService';
import { obtenerUsuarios } from '../../services/usuarioService';

export function ClasesCrud() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [entrenadores, setEntrenadores] = useState<Usuario[]>([]);
  const [filtroDisciplinaId, setFiltroDisciplinaId] = useState('');

  const [disciplinaId, setDisciplinaId] = useState('');
  const [entrenadorId, setEntrenadorId] = useState('');
  const [diaSemana, setDiaSemana] = useState('lunes');
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('10:00');
  const [cupos, setCupos] = useState('20');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [claseDetalle, setClaseDetalle] = useState<Clase | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = async (idDisciplinaFiltro: string) => {
    try {
      const [listaC, listaD, listaU] = await Promise.all([
        obtenerClases(idDisciplinaFiltro),
        obtenerDisciplinas(),
        obtenerUsuarios(),
      ]);
      setClases(listaC);
      setDisciplinas(listaD);
      setEntrenadores(listaU.filter((u) => u.rol === 'entrenador'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarDatos(filtroDisciplinaId);
    };
    iniciar();
  }, [filtroDisciplinaId]);

  const limpiarFormulario = () => {
    setDisciplinaId('');
    setEntrenadorId('');
    setDiaSemana('lunes');
    setHoraInicio('09:00');
    setHoraFin('10:00');
    setCupos('20');
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const datos = {
        disciplinaId: Number(disciplinaId),
        entrenadorId: Number(entrenadorId),
        diaSemana,
        horaInicio,
        horaFin,
        cupos: Number(cupos),
      };

      if (editandoId) {
        await modificarClase(editandoId, datos);
        if (claseDetalle?.id === editandoId) {
          const detalleActualizado = await obtenerClasePorId(editandoId);
          setClaseDetalle(detalleActualizado);
        }
        setMensaje('Clase actualizada correctamente');
      } else {
        await crearClase(datos);
        setMensaje('Clase creada correctamente');
      }

      limpiarFormulario();
      await cargarDatos(filtroDisciplinaId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const verDetalleClase = async (id: number) => {
    setError('');
    setMensaje('');
    try {
      const detalle = await obtenerClasePorId(id);
      setClaseDetalle(detalle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el detalle de la clase.');
    }
  };

  const seleccionarParaEditar = (c: Clase) => {
    setError('');
    setMensaje('');
    setEditandoId(c.id);
    setDisciplinaId(String(c.disciplina.id));
    setEntrenadorId(String(c.entrenador.id));
    setDiaSemana(c.diaSemana);
    setHoraInicio(c.horaInicio);
    setHoraFin(c.horaFin);
    setCupos(String(c.cupos));
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta clase?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarClase(id);
      setMensaje('Clase eliminada');
      if (claseDetalle?.id === id) {
        setClaseDetalle(null);
      }
      await cargarDatos(filtroDisciplinaId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  return (
    <div>
      <h2>Clases</h2>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Nota: Recordá habilitarle antes la disciplina al entrenador desde la pestaña "Usuarios"
        (botón Disciplinas).
      </p>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>{editandoId ? `Editando Clase #${editandoId}` : 'Nueva Clase'}</h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Disciplina:</label>
              <select
                value={disciplinaId}
                onChange={(e) => setDisciplinaId(e.target.value)}
                required
              >
                <option value="">-- Seleccionar Disciplina --</option>
                {disciplinas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-form">
              <label>Entrenador:</label>
              <select
                value={entrenadorId}
                onChange={(e) => setEntrenadorId(e.target.value)}
                required
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
              <label>Hora Inicio (HH:mm):</label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>

            <div className="campo-form">
              <label>Hora Fin (HH:mm):</label>
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
              {editandoId ? 'Guardar Cambios' : 'Crear Clase'}
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
        <h3>Listado de Clases</h3>

        <div className="campo-form" style={{ maxWidth: '320px', marginBottom: '14px' }}>
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
              <th>ID</th>
              <th>Disciplina</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Entrenador</th>
              <th>Cupos (Disp. / Total)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.length === 0 ? (
              <tr>
                <td colSpan={7}>No hay clases cargadas.</td>
              </tr>
            ) : (
              clases.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.disciplina?.nombre}</td>
                  <td style={{ textTransform: 'capitalize' }}>{c.diaSemana}</td>
                  <td>
                    {c.horaInicio} a {c.horaFin}
                  </td>
                  <td>
                    {c.entrenador?.nombre} {c.entrenador?.apellido}
                  </td>
                  <td>
                    {c.cuposDisponibles ?? c.cupos} / {c.cupos}
                  </td>
                  <td className="acciones-celda">
                    <button onClick={() => verDetalleClase(c.id)} className="btn btn-gris">
                      Ver Detalle
                    </button>
                    <button onClick={() => seleccionarParaEditar(c)} className="btn btn-azul">
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(c.id)} className="btn btn-rojo">
                      Eliminar
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
            <strong>Día y Horario:</strong>{' '}
            <span style={{ textTransform: 'capitalize' }}>{claseDetalle.diaSemana}</span> de{' '}
            {claseDetalle.horaInicio} a {claseDetalle.horaFin} hs
          </p>
          <p>
            <strong>Disponibilidad:</strong> {claseDetalle.cuposDisponibles ?? claseDetalle.cupos}{' '}
            cupos libres de {claseDetalle.cupos} totales
          </p>

          <div className="acciones-celda" style={{ marginTop: '14px' }}>
            <button
              type="button"
              onClick={() => seleccionarParaEditar(claseDetalle)}
              className="btn btn-azul"
            >
              Editar Clase
            </button>
            <button
              type="button"
              onClick={() => handleEliminar(claseDetalle.id)}
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
      )}
    </div>
  );
}
