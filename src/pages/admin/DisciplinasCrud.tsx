import { useEffect, useState } from 'react';
import type { Disciplina } from '../../models/Disciplina';
import {
  obtenerDisciplinas,
  crearDisciplina,
  modificarDisciplina,
  eliminarDisciplina,
} from '../../services/disciplinaService';

export function DisciplinasCrud() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarDisciplinas = async () => {
    try {
      const lista = await obtenerDisciplinas();
      setDisciplinas(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarDisciplinas();
    };
    iniciar();
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const datos = {
        nombre,
        descripcion: descripcion.trim() === '' ? null : descripcion,
      };

      if (editandoId) {
        await modificarDisciplina(editandoId, datos);
        setMensaje('Disciplina actualizada correctamente');
      } else {
        await crearDisciplina(datos);
        setMensaje('Disciplina creada correctamente');
      }

      limpiarFormulario();
      await cargarDisciplinas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const seleccionarParaEditar = (d: Disciplina) => {
    setError('');
    setMensaje('');
    setEditandoId(d.id);
    setNombre(d.nombre);
    setDescripcion(d.descripcion || '');
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta disciplina?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarDisciplina(id);
      setMensaje('Disciplina eliminada');
      await cargarDisciplinas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  return (
    <div>
      <h2>Disciplinas</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>{editandoId ? `Editando Disciplina #${editandoId}` : 'Nueva Disciplina'}</h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: Funcional"
              />
            </div>

            <div className="campo-form">
              <label>Descripción (opcional):</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Entrenamiento de cuerpo completo"
              />
            </div>
          </div>

          <div className="acciones-celda">
            <button type="submit" className="btn btn-azul">
              {editandoId ? 'Guardar Cambios' : 'Crear Disciplina'}
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
        <h3>Listado de Disciplinas</h3>
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.length === 0 ? (
              <tr>
                <td colSpan={4}>No hay disciplinas cargadas.</td>
              </tr>
            ) : (
              disciplinas.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.nombre}</td>
                  <td>{d.descripcion || '-'}</td>
                  <td className="acciones-celda">
                    <button onClick={() => seleccionarParaEditar(d)} className="btn btn-azul">
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(d.id)} className="btn btn-rojo">
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
