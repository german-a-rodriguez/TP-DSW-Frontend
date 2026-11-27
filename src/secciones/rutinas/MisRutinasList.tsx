import { useEffect, useState } from 'react';
import type { Rutina } from '../../models/Rutina';
import type { EjercicioRutina } from '../../models/EjercicioRutina';
import { obtenerRutinas } from '../../services/rutinaService';
import { obtenerEjerciciosRutina } from '../../services/ejercicioRutinaService';
import { AccionListado, ListadoCrud } from '../../components/ListadoCrud';

export function MisRutinasList() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [todosRenglones, setTodosRenglones] = useState<EjercicioRutina[]>([]);
  const [rutinaDetalle, setRutinaDetalle] = useState<Rutina | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarRutinas = async () => {
      try {
        const [lista, renglones] = await Promise.all([
          obtenerRutinas(),
          obtenerEjerciciosRutina(),
        ]);
        setRutinas(lista);
        setTodosRenglones(renglones);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar tus rutinas.');
      } finally {
        setCargando(false);
      }
    };
    cargarRutinas();
  }, []);

  const renglonesDeDetalle = rutinaDetalle
    ? todosRenglones.filter((er) => {
        const idRut = typeof er.rutina === 'object' ? er.rutina.id : er.rutina;
        return idRut === rutinaDetalle.id;
      })
    : [];

  return (
    <div>
      <h2>Mis rutinas</h2>
      {cargando && <p role="status">Cargando rutinas…</p>}
      {error && <div className="mensaje-error">{error}</div>}
      {!cargando && !error && (
        <ListadoCrud titulo="Rutinas asignadas">
          {rutinas.length === 0 ? (
            <p>Todavía no tenés rutinas asignadas por un entrenador.</p>
          ) : (
            <table className="tabla-crud">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción / Ejercicios</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rutinas.map((rutina) => (
                  <tr key={rutina.id}>
                    <td>{rutina.id}</td>
                    <td className="listado-nombre">{rutina.nombre}</td>
                    <td>{rutina.descripcion}</td>
                    <td>
                      <span className={`etiqueta-estado estado-${rutina.estado}`}>
                        {rutina.estado}
                      </span>
                    </td>
                    <td className="acciones-celda listado-acciones">
                      <AccionListado
                        accion="detalle"
                        etiqueta={`Ver detalle rutina #${rutina.id}`}
                        onClick={() => setRutinaDetalle(rutina)}
                      >
                        Ver detalle
                      </AccionListado>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ListadoCrud>
      )}

      {rutinaDetalle && (
        <div className="tarjeta">
          <h3>Detalle de rutina: {rutinaDetalle.nombre}</h3>
          <p>{rutinaDetalle.descripcion}</p>
          <table className="tabla-crud">
            <thead>
              <tr>
                <th>Día</th>
                <th>Orden</th>
                <th>Ejercicio</th>
                <th>Series</th>
                <th>Repeticiones</th>
              </tr>
            </thead>
            <tbody>
              {renglonesDeDetalle.length === 0 ? (
                <tr>
                  <td colSpan={5}>Esta rutina no tiene ejercicios cargados todavía.</td>
                </tr>
              ) : (
                renglonesDeDetalle.map((er) => (
                  <tr key={er.id}>
                    <td>Día {er.dia}</td>
                    <td>{er.orden}</td>
                    <td className="listado-nombre">
                      {typeof er.ejercicio === 'object' ? er.ejercicio.nombre : `#${er.ejercicio}`}
                    </td>
                    <td>{er.series}</td>
                    <td>{er.repeticiones}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="acciones-celda" style={{ marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setRutinaDetalle(null)}
              className="btn btn-gris"
            >
              Cerrar detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}