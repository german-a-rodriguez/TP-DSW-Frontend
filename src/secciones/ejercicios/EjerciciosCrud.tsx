import { useEffect, useState } from 'react';
import { AccionListado, ListadoCrud } from '../../components/ListadoCrud';
import type { Categoria } from '../../models/Categoria';
import type { Ejercicio } from '../../models/Ejercicio';
import { obtenerCategorias } from '../../services/categoriaService';
import {
  crearEjercicio,
  eliminarEjercicio,
  modificarEjercicio,
  obtenerEjercicios,
} from '../../services/ejercicioService';

export function EjerciciosCrud() {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState('');

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = async () => {
    try {
      const [listaE, listaC] = await Promise.all([
        obtenerEjercicios(),
        obtenerCategorias(),
      ]);
      setEjercicios(listaE);
      setCategorias(listaC);
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
    setNombre('');
    setDescripcion('');
    setCategoriaId('');
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    const descripcionLimpia = descripcion.trim() === '' ? null : descripcion.trim();

    try {
      if (editandoId) {
        await modificarEjercicio(editandoId, {
          nombre,
          descripcion: descripcionLimpia,
          categoriaId: Number(categoriaId),
        });
        setMensaje('Ejercicio actualizado correctamente');
      } else {
        await crearEjercicio({
          nombre,
          descripcion: descripcionLimpia,
          categoriaId: Number(categoriaId),
        });
        setMensaje('Ejercicio creado correctamente');
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const seleccionarParaEditar = (ej: Ejercicio) => {
    setError('');
    setMensaje('');
    setEditandoId(ej.id);
    setNombre(ej.nombre);
    setDescripcion(ej.descripcion || '');
    const idCat = typeof ej.categoria === 'object' ? ej.categoria.id : ej.categoria;
    setCategoriaId(String(idCat));
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este ejercicio?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarEjercicio(id);
      setMensaje('Ejercicio eliminado');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const obtenerNombreCategoria = (catRel: Categoria | number) => {
    if (typeof catRel === 'object' && catRel?.nombre) return catRel.nombre;
    const encontrada = categorias.find((c) => c.id === catRel);
    return encontrada ? encontrada.nombre : `#${catRel}`;
  };

  const ejerciciosFiltrados =
    filtroCategoriaId === ''
      ? ejercicios
      : ejercicios.filter((ej) => {
          const idCat = typeof ej.categoria === 'object' ? ej.categoria.id : ej.categoria;
          return String(idCat) === filtroCategoriaId;
        });

  return (
    <div>
      <h2>Ejercicios</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>{editandoId ? `Editando Ejercicio #${editandoId}` : 'Nuevo Ejercicio'}</h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Categoría:</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
              >
                <option value="">-- Seleccionar Categoría --</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-form">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={80}
                required
                placeholder="Ej: Press banca plano"
              />
            </div>

            <div className="campo-form">
              <label>Descripción (opcional):</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={255}
                placeholder="Ej: Barra olímpica, retracción escapular"
              />
            </div>
          </div>

          <div className="acciones-celda">
            <button type="submit" className="btn btn-lima">
              {editandoId ? 'Guardar Cambios' : 'Crear Ejercicio'}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarFormulario} className="btn btn-gris">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <ListadoCrud
        titulo="Listado de Ejercicios"
        filtros={
          <div className="campo-form" style={{ maxWidth: '320px', marginBottom: '14px' }}>
            <label>Filtrar por Categoría:</label>
            <select
              value={filtroCategoriaId}
              onChange={(e) => setFiltroCategoriaId(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ejerciciosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay ejercicios cargados.</td>
              </tr>
            ) : (
              ejerciciosFiltrados.map((ej) => (
                <tr key={ej.id}>
                  <td>{ej.id}</td>
                  <td className="listado-nombre">{ej.nombre}</td>
                  <td>{obtenerNombreCategoria(ej.categoria)}</td>
                  <td>{ej.descripcion || '-'}</td>
                  <td className="acciones-celda listado-acciones">
                    <AccionListado
                      accion="editar"
                      etiqueta={`Editar ejercicio #${ej.id}`}
                      onClick={() => seleccionarParaEditar(ej)}
                    >
                      Editar
                    </AccionListado>
                    <AccionListado
                      accion="eliminar"
                      etiqueta={`Eliminar ejercicio #${ej.id}`}
                      onClick={() => handleEliminar(ej.id)}
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