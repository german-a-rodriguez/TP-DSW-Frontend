import { useEffect, useState } from 'react';
import type { Membresia } from '../../models/Membresia';
import type { Plan } from '../../models/Plan';
import { obtenerMembresias, crearMembresia, confirmarPagoMembresia } from '../../services/membresiaService';
import { obtenerPlanes } from '../../services/planService';
import { obtenerUsuarioLogueado } from '../../utils/auth';

export function MembresiasPage() {
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [planId, setPlanId] = useState('');
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = async () => {
    setErrorCarga('');
    try {
      const [listaMembresias, listaPlanes] = await Promise.all([
        obtenerMembresias(), obtenerPlanes(),
      ]);
      setMembresias(listaMembresias);
      setPlanes(listaPlanes);
    } catch (err) {
      setErrorCarga(err instanceof Error ? err.message : 'No se pudieron cargar las membresías.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      await cargarDatos();
    };
    iniciar();
  }, []);

  const contratarPlan = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    const usuario = obtenerUsuarioLogueado();
    if (!usuario) {
      setError('No se encontró la sesión del usuario.');
      return;
    }

    try {
      await crearMembresia({ clienteId: usuario.id, planId: Number(planId) });
      setMensaje('Membresía creada. Ahora podés confirmar su pago en la lista.');
      setPlanId('');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo contratar el plan.');
    }
  };

  const pagarMembresia = async (membresia: Membresia) => {
    setError('');
    setMensaje('');
    try {
      await confirmarPagoMembresia(membresia.id, membresia.fechaFin);
      setMensaje('Pago confirmado. Tu membresía está activa y ya podés solicitar una rutina.');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo confirmar el pago.');
    }
  };

  const nombrePlan = (plan: Plan | number) => {
    const id = typeof plan === 'number' ? plan : plan.id;
    return planes.find((p) => p.id === id)?.nombre || `Plan #${id}`;
  };
  const planesActivos = planes.filter((plan) => plan.activo);

  return (
    <div>
      <h2>Mis membresías</h2>
      {cargando && <p role="status">Cargando membresías…</p>}
      {errorCarga && <div className="mensaje-error">{errorCarga}</div>}
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      {!cargando && !errorCarga && (
        <>
          <form onSubmit={contratarPlan} className="tarjeta">
            <div className="campos-formulario">
              <h3>Contratar un plan</h3>
              <div className="campo-form">
                <label>Plan:</label>
                <select value={planId} onChange={(e) => setPlanId(e.target.value)} required>
                  <option value="">-- Elegir un plan --</option>
                  {planesActivos.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.nombre} (${plan.precio} - {plan.duracionEnMeses} mes/es)
                    </option>
                  ))}
                </select>
              </div>
              {planesActivos.length === 0 && <p>No hay planes disponibles para contratar.</p>}
              <button type="submit" className="btn btn-azul" disabled={planesActivos.length === 0}>
                Contratar plan
              </button>
            </div>
          </form>

          <div className="tarjeta">
            <h3>Membresías contratadas</h3>
            {membresias.length === 0 ? <p>Todavía no tenés membresías.</p> : (
              <table className="tabla-crud">
                <thead>
                  <tr><th>Plan</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {membresias.map((membresia) => (
                    <tr key={membresia.id}>
                      <td>{nombrePlan(membresia.plan)}</td>
                      <td>{membresia.fechaInicio.slice(0, 10)}</td>
                      <td>{membresia.fechaFin.slice(0, 10)}</td>
                      <td>{membresia.estadoMembresia}</td>
                      <td>
                        {membresia.estadoMembresia === 'pendiente' && (
                          <button className="btn btn-azul"
                            onClick={() => pagarMembresia(membresia)}>
                            Confirmar pago en efectivo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
