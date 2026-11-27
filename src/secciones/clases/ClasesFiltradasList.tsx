
import { useCallback, useEffect, useState } from 'react';
import type { Clase } from '../../models/Clase';
import type { Disciplina } from '../../models/Disciplina';
import type { Inscripcion } from '../../models/Inscripcion';

import { obtenerClases, obtenerClasePorId } from '../../services/claseService';
import { obtenerDisciplinas } from '../../services/disciplinaService';
import {
  obtenerInscripciones,
  crearInscripcion,
  cancelarInscripcion,
} from '../../services/inscripcionService';
import { obtenerUsuarioLogueado } from '../../utils/auth';

export function ClasesFiltradasList() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [filtroDisciplinaId, setFiltroDisciplinaId] = useState('');
  const [claseDetalle, setClaseDetalle] = useState<Clase | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Cargar disciplinas
  useEffect(() => {
    const cargar = async () => {
      try {
        const listaD = await obtenerDisciplinas();
        setDisciplinas(listaD);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las disciplinas.',
        );
      }
    };

    cargar();
  }, []);

  // Cargar clases
  const cargarClases = useCallback(async () => {
    const listaC = await obtenerClases(filtroDisciplinaId);
    setClases(listaC);
  }, [filtroDisciplinaId]);

  // Cargar clases cuando cambia el filtro
  useEffect(() => {
    const cargar = async () => {
      try {
        setError('');
        await cargarClases();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las clases.',
        );
      }
    };

    cargar();
  }, [cargarClases]);

  // Cargar inscripciones
  const cargarInscripciones = useCallback(async () => {
    const listaI = await obtenerInscripciones();
    setInscripciones(listaI);
  }, []);

  useEffect(() => {
    const cargar = async () => {
      try {
        await cargarInscripciones();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las inscripciones.',
        );
      }
    };

    cargar();
  }, [cargarInscripciones]);

  // Ver detalle de una clase
  const verDetalleClase = async (id: number) => {
    setError('');
    setMensaje('');

    try {
      const c = await obtenerClasePorId(id);
      setClaseDetalle(c);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo completar la operación.',
      );
    }
  };

  // Inscribirse a una clase
  const inscribirse = async (claseId: number) => {
    setError('');
    setMensaje('');

    const usuario = obtenerUsuarioLogueado();

    if (!usuario) {
      setError('No se pudo identificar al usuario. Iniciá sesión nuevamente.');
      return;
    }

    try {
      setProcesando(true);

      await crearInscripcion({
        clienteId: usuario.id,
        claseId,
      });

      setMensaje('¡Te inscribiste correctamente a la clase!');

      await Promise.all([cargarClases(), cargarInscripciones()]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo realizar la inscripción.',
      );
    } finally {
      setProcesando(false);
    }
  };

  // Cancelar inscripción
  const cancelar = async (inscripcion: Inscripcion) => {
    setError('');
    setMensaje('');

    const usuario = obtenerUsuarioLogueado();

    if (!usuario) {
      setError('No se pudo identificar al usuario. Iniciá sesión nuevamente.');
      return;
    }

    try {
      setProcesando(true);

      await cancelarInscripcion(
        usuario.id,
        inscripcion.clase.id,
        inscripcion.fechaInscripcion,
      );

      setMensaje('La inscripción se canceló correctamente.');

      await Promise.all([cargarClases(), cargarInscripciones()]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cancelar la inscripción.',
      );
    } finally {
      setProcesando(false);
    }
  };

  // Buscar inscripción activa de una clase
  const buscarInscripcionActiva = (claseId: number) => {
    return inscripciones.find(
      (i) =>
        i.clase.id === claseId && i.estadoInscripcion === 'activa',
    );
  };

  return (
    <div>
      <h2>Clases por disciplina</h2>

      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

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
                <td colSpan={6}>
                  No hay clases para la disciplina seleccionada.
                </td>
              </tr>
            ) : (
              clases.map((c) => {
                const inscripcion = buscarInscripcionActiva(c.id);
                const cupos = c.cuposDisponibles ?? c.cupos;

                return (
                  <tr key={c.id}>
                    <td>{c.disciplina?.nombre}</td>

                    <td style={{ textTransform: 'capitalize' }}>
                      {c.diaSemana}
                    </td>

                    <td>
                      {c.horaInicio} a {c.horaFin} hs
                    </td>

                    <td>
                      {c.entrenador?.nombre} {c.entrenador?.apellido}
                    </td>

                    <td>
                      {cupos} disponibles de {c.cupos}
                    </td>

                    <td className="acciones-celda">
                      <button
                        onClick={() => verDetalleClase(c.id)}
                        className="btn btn-azul"
                      >
                        Ver Detalle
                      </button>

                      {inscripcion ? (
                        <button
                          onClick={() => cancelar(inscripcion)}
                          className="btn btn-gris"
                          disabled={procesando}
                        >
                          Cancelar inscripción
                        </button>
                      ) : (
                        <button
                          onClick={() => inscribirse(c.id)}
                          className="btn btn-azul"
                          disabled={procesando || cupos <= 0}
                        >
                          {cupos <= 0 ? 'Sin cupos' : 'Inscribirme'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
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
            <span style={{ textTransform: 'capitalize' }}>
              {claseDetalle.diaSemana}
            </span>{' '}
            de {claseDetalle.horaInicio} a {claseDetalle.horaFin} hs
          </p>

          <p>
            <strong>Disponibilidad:</strong>{' '}
            {claseDetalle.cuposDisponibles ?? claseDetalle.cupos} cupos libres
            de {claseDetalle.cupos} totales
          </p>

          <button
            onClick={() => setClaseDetalle(null)}
            className="btn btn-gris"
          >
            Cerrar Detalle
          </button>
        </div>
      )}
    </div>
  );
}
