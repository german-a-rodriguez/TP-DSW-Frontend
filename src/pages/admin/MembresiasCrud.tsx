import { useEffect, useState } from 'react';
import type { Membresia } from '../../models/Membresia';
import type { Usuario } from '../../models/Usuario';
import type { Plan } from '../../models/Plan';
import {
  obtenerMembresias,
  crearMembresia,
  modificarMembresia,
  eliminarMembresia,
  confirmarPagoMembresia,
} from '../../services/membresiaService';
import { obtenerUsuarios } from '../../services/usuarioService';
import { obtenerPlanes } from '../../services/planService';

export function MembresiasCrud() {
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);

  const [clienteId, setClienteId] = useState('');
  const [planId, setPlanId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoMembresia, setEstadoMembresia] = useState<
    'pendiente' | 'activa' | 'vencida' | 'cancelada'
  >('pendiente');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = async () => {
    try {
      const [listaM, listaU, listaP] = await Promise.all([
        obtenerMembresias(),
        obtenerUsuarios(),
        obtenerPlanes(),
      ]);
      setMembresias(listaM);
      setClientes(listaU.filter((u) => u.rol === 'cliente'));
      setPlanes(listaP);
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
    setClienteId('');
    setPlanId('');
    setFechaInicio('');
    setFechaFin('');
    setEstadoMembresia('pendiente');
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      if (editandoId) {
        await modificarMembresia(editandoId, {
          fechaInicio,
          fechaFin,
          estadoMembresia,
        });
        setMensaje('Membresía actualizada');
      } else {
        await crearMembresia({
          clienteId: Number(clienteId),
          planId: Number(planId),
        });
        setMensaje('Membresía creada correctamente');
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const obtenerIdRelacion = (rel: Usuario | Plan | number): number => {
    return typeof rel === 'object' && rel !== null ? rel.id : Number(rel);
  };

  const obtenerNombreCliente = (rel: Usuario | number): string => {
    const id = obtenerIdRelacion(rel);
    const encontrado = clientes.find((c) => c.id === id);
    return encontrado ? `${encontrado.nombre} ${encontrado.apellido}` : `Cliente #${id}`;
  };

  const obtenerNombrePlan = (rel: Plan | number): string => {
    const id = obtenerIdRelacion(rel);
    const encontrado = planes.find((p) => p.id === id);
    return encontrado ? encontrado.nombre : `Plan #${id}`;
  };

  const seleccionarParaEditar = (m: Membresia) => {
    setError('');
    setMensaje('');
    setEditandoId(m.id);
    setClienteId(String(obtenerIdRelacion(m.cliente)));
    setPlanId(String(obtenerIdRelacion(m.plan)));
    setFechaInicio(m.fechaInicio ? m.fechaInicio.slice(0, 10) : '');
    setFechaFin(m.fechaFin ? m.fechaFin.slice(0, 10) : '');
    setEstadoMembresia(m.estadoMembresia);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta membresía?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarMembresia(id);
      setMensaje('Membresía eliminada');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const handleActivarConPago = async (m: Membresia) => {
    setError('');
    setMensaje('');

    try {
      await confirmarPagoMembresia(m.id, m.fechaFin);
      setMensaje('Pago confirmado y membresía activada');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  return (
    <div>
      <h2>Membresías</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>{editandoId ? `Editando Membresía #${editandoId}` : 'Nueva Membresía'}</h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Cliente:</label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
                disabled={editandoId !== null}
              >
                <option value="">-- Seleccionar Cliente --</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-form">
              <label>Plan:</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                required
                disabled={editandoId !== null}
              >
                <option value="">-- Seleccionar Plan --</option>
                {planes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - ${p.precio} ({p.duracionEnMeses} mes/es)
                  </option>
                ))}
              </select>
            </div>

            {editandoId && (
              <>
                <div className="campo-form">
                  <label>Fecha de Inicio:</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-form">
                  <label>Fecha de Fin:</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-form">
                  <label>Estado:</label>
                  <select
                    value={estadoMembresia}
                    onChange={(e) =>
                      setEstadoMembresia(
                        e.target.value as 'pendiente' | 'activa' | 'vencida' | 'cancelada'
                      )
                    }
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="activa">Activa</option>
                    <option value="vencida">Vencida</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="acciones-celda">
            <button type="submit" className="btn btn-azul">
              {editandoId ? 'Guardar Cambios' : 'Crear Membresía'}
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
        <h3>Listado de Membresías</h3>
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Plan</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {membresias.length === 0 ? (
              <tr>
                <td colSpan={7}>No hay membresías registradas.</td>
              </tr>
            ) : (
              membresias.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{obtenerNombreCliente(m.cliente)}</td>
                  <td>{obtenerNombrePlan(m.plan)}</td>
                  <td>{m.fechaInicio ? m.fechaInicio.slice(0, 10) : '-'}</td>
                  <td>{m.fechaFin ? m.fechaFin.slice(0, 10) : '-'}</td>
                  <td>{m.estadoMembresia}</td>
                  <td className="acciones-celda">
                    {m.estadoMembresia === 'pendiente' && (
                      <button
                        onClick={() => handleActivarConPago(m)}
                        className="btn btn-verde"
                      >
                        Confirmar Pago (Activar)
                      </button>
                    )}
                    <button onClick={() => seleccionarParaEditar(m)} className="btn btn-azul">
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(m.id)} className="btn btn-rojo">
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
