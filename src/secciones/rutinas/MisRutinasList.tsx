import { useEffect, useState } from 'react';
import type { Rutina } from '../../models/Rutina';
import { obtenerRutinas } from '../../services/rutinaService';
import { ListadoCrud } from '../../components/ListadoCrud';

export function MisRutinasList() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarRutinas = async () => {
      try {
        const lista = await obtenerRutinas();
        setRutinas(lista);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar tus rutinas.');
      } finally {
        setCargando(false);
      }
    };
    cargarRutinas();
  }, []);

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
                <tr><th>ID</th><th>Nombre</th><th>Descripción / Ejercicios</th><th>Estado</th></tr>
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ListadoCrud>
      )}
    </div>
  );
}
