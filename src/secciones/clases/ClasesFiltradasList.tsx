import { useEffect, useState } from 'react';
import type { Clase } from '../../models/Clase';
import type { Disciplina } from '../../models/Disciplina';
import { obtenerClases, obtenerClasePorId } from '../../services/claseService';
import { obtenerDisciplinas } from '../../services/disciplinaService';

// Listado de clases para el cliente (solo lectura).
// El admin y el entrenador editan las clases desde ClasesCrud.
export function ClasesFiltradasList() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [filtroDisciplinaId, setFiltroDisciplinaId] = useState('');
  const [claseDetalle, setClaseDetalle] = useState<Clase | null>(null);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const cargarClases = async () => {
      try {
        const listaC = await obtenerClases(filtroDisciplinaId);
        setClases(listaC);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
      }
    };
    cargarClases();
  }, [filtroDisciplinaId]);

  const verDetalleClase = async (id: number) => {
    setError('');
    try {
      const c = await obtenerClasePorId(id);
      setClaseDetalle(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  return (
    <div>
      <h2>Clases por disciplina</h2>
      {error && <div className="mensaje-error">{error}</div>}

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
            <strong>Día y Horario:</strong>{' '}
            <span style={{ textTransform: 'capitalize' }}>{claseDetalle.diaSemana}</span> de{' '}
            {claseDetalle.horaInicio} a {claseDetalle.horaFin} hs
          </p>
          <p>
            <strong>Disponibilidad:</strong> {claseDetalle.cuposDisponibles ?? claseDetalle.cupos}{' '}
            cupos libres de {claseDetalle.cupos} totales
          </p>
          <button onClick={() => setClaseDetalle(null)} className="btn btn-gris">
            Cerrar Detalle
          </button>
        </div>
      )}
    </div>
  );
}
