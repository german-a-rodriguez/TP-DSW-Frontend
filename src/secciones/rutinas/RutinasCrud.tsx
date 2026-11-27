import { AccionListado, ListadoCrud } from '../../components/ListadoCrud';
import { useEffect, useState } from 'react';
import type { Rutina } from '../../models/Rutina';
import type { Solicitud } from '../../models/Solicitud';
import type { Usuario } from '../../models/Usuario';
import type { Categoria } from '../../models/Categoria';
import type { Ejercicio } from '../../models/Ejercicio';
import type { DiaRutina, EjercicioRutina } from '../../models/EjercicioRutina';
import {
  obtenerRutinas,
  crearRutina,
  modificarRutina,
  eliminarRutina,
} from '../../services/rutinaService';
import { obtenerSolicitudes } from '../../services/solicitudService';
import { obtenerUsuarios } from '../../services/usuarioService';
import { obtenerCategorias } from '../../services/categoriaService';
import { obtenerEjercicios } from '../../services/ejercicioService';
import {
  obtenerEjerciciosRutina,
  crearEjercicioRutina,
  eliminarEjercicioRutina,
} from '../../services/ejercicioRutinaService';
import { obtenerUsuarioLogueado } from '../../utils/auth';

interface RutinasCrudProps {
  solicitudPreseleccionadaId?: number | null;
}

export function RutinasCrud({ solicitudPreseleccionadaId }: RutinasCrudProps) {
  const usuarioLogueado = obtenerUsuarioLogueado();

  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [entrenadores, setEntrenadores] = useState<Usuario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [renglones, setRenglones] = useState<EjercicioRutina[]>([]);

  const [solicitudId, setSolicitudId] = useState(
    solicitudPreseleccionadaId ? String(solicitudPreseleccionadaId) : ''
  );
  const [entrenadorId, setEntrenadorId] = useState(
    usuarioLogueado?.rol === 'entrenador' ? String(usuarioLogueado.id) : ''
  );
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<'activa' | 'inactiva'>('activa');

  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Estado para armar renglones (EjercicioRutina) sobre una rutina
  const [rutinaActivaId, setRutinaActivaId] = useState('');
  const [categoriaFiltroId, setCategoriaFiltroId] = useState('');
  const [ejercicioId, setEjercicioId] = useState('');
  const [dia, setDia] = useState<DiaRutina>('A');
  const [orden, setOrden] = useState('1');
  const [series, setSeries] = useState('3');
  const [repeticiones, setRepeticiones] = useState('10');

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = async () => {
    try {
      const [listaR, listaS, listaU, listaC, listaE, listaER] = await Promise.all([
        obtenerRutinas(),
        obtenerSolicitudes(),
        obtenerUsuarios(),
        obtenerCategorias(),
        obtenerEjercicios(),
        obtenerEjerciciosRutina(),
      ]);
      setRutinas(listaR);
      setSolicitudes(listaS);
      setEntrenadores(listaU.filter((u) => u.rol === 'entrenador'));
      setCategorias(listaC);
      setEjercicios(listaE);
      setRenglones(listaER);
      setRutinaActivaId((actual) => {
        if (actual) return actual;
        return listaR.length > 0 ? String(listaR[0].id) : '';
      });
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
    setSolicitudId('');
    setNombre('');
    setDescripcion('');
    setEstado('activa');
    setEditandoId(null);
    if (usuarioLogueado?.rol === 'entrenador') {
      setEntrenadorId(String(usuarioLogueado.id));
    } else {
      setEntrenadorId('');
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      if (editandoId) {
        await modificarRutina(editandoId, {
          nombre,
          descripcion,
          estado,
        });
        setRutinaActivaId(String(editandoId));
        setMensaje('Rutina actualizada correctamente');
      } else {
        const creada = await crearRutina({
          nombre,
          descripcion,
          estado,
          solicitudId: Number(solicitudId),
          entrenadorId: Number(entrenadorId),
        });
        if (creada?.data?.id) {
          setRutinaActivaId(String(creada.data.id));
        }
        setMensaje('¡Rutina creada y asignada al cliente con éxito! ');
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const seleccionarParaEditar = (r: Rutina) => {
    setError('');
    setMensaje('');
    setEditandoId(r.id);
    setRutinaActivaId(String(r.id));
    setNombre(r.nombre);
    setDescripcion(r.descripcion);
    setEstado(r.estado);
    const idSol = typeof r.solicitud === 'object' ? r.solicitud.id : r.solicitud;
    const idEnt = typeof r.entrenador === 'object' ? r.entrenador.id : r.entrenador;
    setSolicitudId(String(idSol));
    setEntrenadorId(String(idEnt));
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta rutina?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarRutina(id);
      if (rutinaActivaId === String(id)) {
        setRutinaActivaId('');
      }
      setMensaje('Rutina eliminada');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const handleAgregarRenglon = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!rutinaActivaId) {
      setError('Seleccioná primero una rutina para agregar ejercicios.');
      return;
    }

    try {
      await crearEjercicioRutina({
        rutinaId: Number(rutinaActivaId),
        ejercicioId: Number(ejercicioId),
        dia,
        orden: Number(orden),
        series: Number(series),
        repeticiones: Number(repeticiones),
      });
      setEjercicioId('');
      setOrden(String(Number(orden) + 1));
      setMensaje('Ejercicio agregado a la rutina');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar el ejercicio.');
    }
  };

  const handleQuitarRenglon = async (idRenglon: number) => {
    if (!window.confirm('¿Quitar este ejercicio de la rutina?')) return;
    setError('');
    setMensaje('');

    try {
      await eliminarEjercicioRutina(idRenglon);
      setMensaje('Ejercicio quitado de la rutina');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo quitar el ejercicio.');
    }
  };

  const obtenerTextoSolicitud = (solRel: Solicitud | number) => {
    const id = typeof solRel === 'object' ? solRel.id : solRel;
    const sol = solicitudes.find((s) => s.id === id);
    if (sol) {
      return `Solicitud #${sol.id} - ${sol.cliente?.nombre} ${sol.cliente?.apellido} (${sol.objetivo})`;
    }
    return `Solicitud #${id}`;
  };

  const ejerciciosFiltrados =
    categoriaFiltroId === ''
      ? ejercicios
      : ejercicios.filter((ej) => {
          const idCat = typeof ej.categoria === 'object' ? ej.categoria.id : ej.categoria;
          return String(idCat) === categoriaFiltroId;
        });

  const renglonesDeRutina = renglones.filter((er) => {
    const idRut = typeof er.rutina === 'object' ? er.rutina.id : er.rutina;
    return String(idRut) === rutinaActivaId;
  });

  const obtenerNombreEjercicio = (ejRel: Ejercicio | number) => {
    if (typeof ejRel === 'object' && ejRel?.nombre) return ejRel.nombre;
    const found = ejercicios.find((e) => e.id === ejRel);
    return found ? found.nombre : `#${ejRel}`;
  };

  return (
    <div>
      <h2>Rutinas</h2>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>
            {editandoId
              ? `Editando Rutina #${editandoId}`
              : 'Asignar Nueva Rutina a Solicitud de Cliente'}
          </h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Solicitud del Cliente:</label>
              <select
                value={solicitudId}
                onChange={(e) => setSolicitudId(e.target.value)}
                required
                disabled={editandoId !== null}
              >
                <option value="">-- Seleccionar Solicitud Pendiente --</option>
                {solicitudes
                  .filter(
                    (s) =>
                      s.estado === 'pendiente' ||
                      (editandoId !== null && String(s.id) === solicitudId)
                  )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} - {s.cliente?.nombre} {s.cliente?.apellido} | Objetivo: {s.objetivo}
                    </option>
                  ))}
              </select>
            </div>

            <div className="campo-form">
              <label>Entrenador que asigna:</label>
              <select
                value={entrenadorId}
                onChange={(e) => setEntrenadorId(e.target.value)}
                required
                disabled={editandoId !== null || usuarioLogueado?.rol === 'entrenador'}
              >
                <option value="">-- Seleccionar Entrenador --</option>
                {entrenadores.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.nombre} {ent.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-form">
              <label>Nombre de la Rutina:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: Rutina Hipertrofia 4 días"
              />
            </div>

            <div className="campo-form">
              <label>Estado:</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as 'activa' | 'inactiva')}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>

          <div className="campo-form" style={{ marginBottom: '12px' }}>
            <label>Descripción / Indicaciones generales:</label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              placeholder="Ej: Enfoque progresivo en técnica y control de carga"
            />
          </div>

          <div className="acciones-celda">
            <button type="submit" className="btn btn-lima">
              {editandoId ? 'Guardar Cambios' : 'Crear y Asignar Rutina'}
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
        <div className="campos-formulario">
          <h3>Armar ejercicios de la rutina (Categoría → Ejercicio)</h3>

          <form onSubmit={handleAgregarRenglon}>
            <div className="grilla-form">
              <div className="campo-form">
                <label>Rutina:</label>
                <select
                  value={rutinaActivaId}
                  onChange={(e) => setRutinaActivaId(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Rutina --</option>
                  {rutinas.map((r) => (
                    <option key={r.id} value={r.id}>
                      #{r.id} - {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-form">
                <label>Filtrar por Categoría:</label>
                <select
                  value={categoriaFiltroId}
                  onChange={(e) => {
                    setCategoriaFiltroId(e.target.value);
                    setEjercicioId('');
                  }}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-form">
                <label>Ejercicio:</label>
                <select
                  value={ejercicioId}
                  onChange={(e) => setEjercicioId(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Ejercicio --</option>
                  {ejerciciosFiltrados.map((ej) => (
                    <option key={ej.id} value={ej.id}>
                      {ej.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-form">
                <label>Día:</label>
                <select
                  value={dia}
                  onChange={(e) => setDia(e.target.value as DiaRutina)}
                >
                  <option value="A">Día A</option>
                  <option value="B">Día B</option>
                  <option value="C">Día C</option>
                  <option value="D">Día D</option>
                </select>
              </div>

              <div className="campo-form">
                <label>Orden (1..30):</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  required
                />
              </div>

              <div className="campo-form">
                <label>Series (1..10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  required
                />
              </div>

              <div className="campo-form">
                <label>Repeticiones (1..100):</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={repeticiones}
                  onChange={(e) => setRepeticiones(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="acciones-celda">
              <button type="submit" className="btn btn-lima">
                Agregar ejercicio a la rutina
              </button>
            </div>
          </form>

          {rutinaActivaId && (
            <table className="tabla-crud" style={{ marginTop: '14px' }}>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Orden</th>
                  <th>Ejercicio</th>
                  <th>Series</th>
                  <th>Repeticiones</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {renglonesDeRutina.length === 0 ? (
                  <tr>
                    <td colSpan={6}>Esta rutina todavía no tiene ejercicios cargados.</td>
                  </tr>
                ) : (
                  renglonesDeRutina.map((er) => (
                    <tr key={er.id}>
                      <td>Día {er.dia}</td>
                      <td>{er.orden}</td>
                      <td className="listado-nombre">{obtenerNombreEjercicio(er.ejercicio)}</td>
                      <td>{er.series}</td>
                      <td>{er.repeticiones}</td>
                      <td className="acciones-celda listado-acciones">
                        <AccionListado
                          accion="eliminar"
                          etiqueta={`Quitar renglón #${er.id}`}
                          onClick={() => handleQuitarRenglon(er.id)}
                        >
                          Quitar
                        </AccionListado>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ListadoCrud titulo="Rutinas Creadas y Asignadas">
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cliente / Solicitud</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rutinas.length === 0 ? (
              <tr>
                <td colSpan={6}>No hay rutinas cargadas todavía.</td>
              </tr>
            ) : (
              rutinas.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td className="listado-nombre">{r.nombre}</td>
                  <td>{obtenerTextoSolicitud(r.solicitud)}</td>
                  <td>{r.descripcion}</td>
                  <td>
                    <span className={`etiqueta-estado estado-${r.estado}`}>{r.estado}</span>
                  </td>
                  <td className="acciones-celda listado-acciones">
                    <AccionListado
                      accion="editar"
                      etiqueta={`Editar rutina #${r.id}`}
                      onClick={() => seleccionarParaEditar(r)}
                    >
                      Editar
                    </AccionListado>
                    <AccionListado
                      accion="eliminar"
                      etiqueta={`Eliminar rutina #${r.id}`}
                      onClick={() => handleEliminar(r.id)}
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