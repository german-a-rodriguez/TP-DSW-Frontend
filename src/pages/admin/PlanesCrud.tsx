import { useEffect, useState } from 'react';
import type { Plan } from '../../models/Plan';
import {
  obtenerPlanes,
  crearPlan,
  modificarPlan,
  eliminarPlan,
} from '../../services/planService';

export function PlanesCrud() {
  const [planes, setPlanes] = useState<Plan[]>([]);

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracionEnMeses, setDuracionEnMeses] = useState('1');
  const [incluyeClasesGrupales, setIncluyeClasesGrupales] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarPlanes = async () => {
    try {
      const lista = await obtenerPlanes();
      setPlanes(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarPlanes();
    };
    iniciar();
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setPrecio('');
    setDuracionEnMeses('1');
    setIncluyeClasesGrupales(false);
    setDescripcion('');
    setActivo(true);
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const datos = {
        nombre,
        precio: Number(precio),
        duracionEnMeses: Number(duracionEnMeses),
        incluyeClasesGrupales,
        descripcion,
        activo,
      };

      if (editandoId) {
        await modificarPlan(editandoId, datos);
        setMensaje('Plan actualizado con éxito');
      } else {
        await crearPlan(datos);
        setMensaje('Plan creado con éxito');
      }

      limpiarFormulario();
      await cargarPlanes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const seleccionarParaEditar = (p: Plan) => {
    setError('');
    setMensaje('');
    setEditandoId(p.id);
    setNombre(p.nombre);
    setPrecio(String(p.precio));
    setDuracionEnMeses(String(p.duracionEnMeses));
    setIncluyeClasesGrupales(p.incluyeClasesGrupales);
    setDescripcion(p.descripcion);
    setActivo(p.activo);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este plan?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarPlan(id);
      setMensaje('Plan eliminado');
      await cargarPlanes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  return (
    <div>
      <h2>Planes</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>{editandoId ? `Editando Plan #${editandoId}` : 'Nuevo Plan'}</h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: Plan Mensual Full"
              />
            </div>

            <div className="campo-form">
              <label>Precio ($):</label>
              <input
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                placeholder="Ej: 25000"
              />
            </div>

            <div className="campo-form">
              <label>Duración (meses):</label>
              <input
                type="number"
                min="1"
                max="120"
                value={duracionEnMeses}
                onChange={(e) => setDuracionEnMeses(e.target.value)}
                required
              />
            </div>

            <div className="campo-form">
              <label>Descripción:</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                placeholder="Ej: Acceso libre a musculación y clases"
              />
            </div>

            <div className="campo-form">
              <label>
                <input
                  type="checkbox"
                  checked={incluyeClasesGrupales}
                  onChange={(e) => setIncluyeClasesGrupales(e.target.checked)}
                />{' '}
                Incluye clases grupales
              </label>
            </div>

            <div className="campo-form">
              <label>
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                />{' '}
                Plan activo
              </label>
            </div>
          </div>

          <div className="acciones-celda">
            <button type="submit" className="btn btn-azul">
              {editandoId ? 'Guardar Cambios' : 'Crear Plan'}
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
        <h3>Listado de Planes</h3>
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Clases Grupales</th>
              <th>Activo</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planes.length === 0 ? (
              <tr>
                <td colSpan={8}>No hay planes cargados.</td>
              </tr>
            ) : (
              planes.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>${p.precio}</td>
                  <td>{p.duracionEnMeses} mes(es)</td>
                  <td>{p.incluyeClasesGrupales ? 'Sí' : 'No'}</td>
                  <td>{p.activo ? 'Sí' : 'No'}</td>
                  <td>{p.descripcion}</td>
                  <td className="acciones-celda">
                    <button onClick={() => seleccionarParaEditar(p)} className="btn btn-azul">
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(p.id)} className="btn btn-rojo">
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
