import { useEffect, useState } from 'react';
import { AccionListado, ListadoCrud } from '../../components/ListadoCrud';
import type { Categoria } from '../../models/Categoria';
import {
  crearCategoria,
  eliminarCategoria,
  modificarCategoria,
  obtenerCategorias,
} from '../../services/categoriaService';

export function CategoriasCrud() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarCategorias = async () => {
    try {
      const lista = await obtenerCategorias();
      setCategorias(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarCategorias();
    };
    iniciar();
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      if (editandoId) {
        await modificarCategoria(editandoId, { nombre });
        setMensaje('Categoría actualizada correctamente');
      } else {
        await crearCategoria({ nombre });
        setMensaje('Categoría creada correctamente');
      }

      limpiarFormulario();
      await cargarCategorias();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const seleccionarParaEditar = (c: Categoria) => {
    setError('');
    setMensaje('');
    setEditandoId(c.id);
    setNombre(c.nombre);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarCategoria(id);
      setMensaje('Categoría eliminada');
      await cargarCategorias();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  return (
    <div>
      <h2>Categorías de ejercicios</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>{editandoId ? `Editando Categoría #${editandoId}` : 'Nueva Categoría'}</h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={80}
                required
                placeholder="Ej: Empuje, Piernas, Espalda"
              />
            </div>
          </div>

          <div className="acciones-celda">
            <button type="submit" className="btn btn-lima">
              {editandoId ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarFormulario} className="btn btn-gris">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <ListadoCrud titulo="Listado de Categorías">
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan={3}>No hay categorías cargadas.</td>
              </tr>
            ) : (
              categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td className="listado-nombre">{c.nombre}</td>
                  <td className="acciones-celda listado-acciones">
                    <AccionListado
                      accion="editar"
                      etiqueta={`Editar categoría #${c.id}`}
                      onClick={() => seleccionarParaEditar(c)}
                    >
                      Editar
                    </AccionListado>
                    <AccionListado
                      accion="eliminar"
                      etiqueta={`Eliminar categoría #${c.id}`}
                      onClick={() => handleEliminar(c.id)}
                    >
                      Eliminar
                    </AccionListado>
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