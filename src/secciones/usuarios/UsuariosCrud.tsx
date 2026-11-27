import { AccionListado, ListadoCrud } from '../../components/ListadoCrud';
import { useEffect, useRef, useState } from 'react';
import type { Usuario } from '../../models/Usuario';
import type { Disciplina } from '../../models/Disciplina';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
  actualizarDisciplinasEntrenador,
} from '../../services/usuarioService';
import { obtenerDisciplinas } from '../../services/disciplinaService';

export function UsuariosCrud() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [filtroRol, setFiltroRol] = useState<'todos' | 'admin' | 'cliente' | 'entrenador'>('todos');

  const [rol, setRol] = useState<'admin' | 'cliente' | 'entrenador'>('cliente');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState<Usuario | null>(null);
  const [disciplinasSeleccionadas, setDisciplinasSeleccionadas] = useState<number[]>([]);
  const [cargandoDisciplinasId, setCargandoDisciplinasId] = useState<number | null>(null);
  const [guardandoDisciplinas, setGuardandoDisciplinas] = useState(false);
  const operacionDisciplinasId = useRef<number | null>(null);
  const usuariosEnEliminacion = useRef(new Set<number>());
  const cargandoDisciplinas = cargandoDisciplinasId !== null;

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = async () => {
    try {
      const [listaUsuarios, listaDisciplinas] = await Promise.all([
        obtenerUsuarios(),
        obtenerDisciplinas(),
      ]);
      setUsuarios(listaUsuarios);
      setDisciplinas(listaDisciplinas);
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
    setRol('cliente');
    setNombre('');
    setApellido('');
    setNombreUsuario('');
    setEmail('');
    setContrasenia('');
    setFechaNacimiento('');
    setTelefono('');
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const datos: Record<string, unknown> = {
        nombre,
        apellido,
        nombreUsuario,
        email,
        fechaNacimiento,
        telefono: telefono.trim() === '' ? null : telefono,
      };

      if (!editandoId) {
        datos.rol = rol;
      }

      if (!editandoId || contrasenia.trim() !== '') {
        datos.contrasenia = contrasenia;
      }

      if (editandoId) {
        await modificarUsuario(editandoId, datos);
        setMensaje('Usuario actualizado correctamente');
      } else {
        await crearUsuario(datos);
        setMensaje('Usuario creado correctamente');
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    }
  };

  const seleccionarParaEditar = (u: Usuario) => {
    setError('');
    setMensaje('');
    setEditandoId(u.id);
    setRol(u.rol);
    setNombre(u.nombre);
    setApellido(u.apellido);
    setNombreUsuario(u.nombreUsuario);
    setEmail(u.email);
    setContrasenia('');
    setFechaNacimiento(u.fechaNacimiento ? u.fechaNacimiento.slice(0, 10) : '');
    setTelefono(u.telefono || '');
  };

  const handleEliminar = async (id: number) => {
    if (operacionDisciplinasId.current === id || usuariosEnEliminacion.current.has(id)) return;
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    usuariosEnEliminacion.current.add(id);
    setError('');
    setMensaje('');

    try {
      await eliminarUsuario(id);
      setEntrenadorSeleccionado((actual) => actual?.id === id ? null : actual);
      setMensaje('Usuario eliminado');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    } finally {
      usuariosEnEliminacion.current.delete(id);
    }
  };

  const abrirDisciplinasEntrenador = async (id: number) => {
    if (operacionDisciplinasId.current !== null || usuariosEnEliminacion.current.has(id)) return;
    operacionDisciplinasId.current = id;
    setCargandoDisciplinasId(id);
    setEntrenadorSeleccionado(null);
    setDisciplinasSeleccionadas([]);
    setError('');
    setMensaje('');
    try {
      const entrenador = await obtenerUsuarioPorId(id);
      if (!Array.isArray(entrenador.disciplinas)) {
        throw new Error('No se pudieron consultar las disciplinas asignadas al entrenador.');
      }
      setDisciplinasSeleccionadas(entrenador.disciplinas.map((d) => d.id));
      setEntrenadorSeleccionado(entrenador);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las disciplinas.');
    } finally {
      operacionDisciplinasId.current = null;
      setCargandoDisciplinasId(null);
    }
  };

  const toggleDisciplinaEntrenador = (idDisciplina: number) => {
    if (operacionDisciplinasId.current !== null) return;
    if (disciplinasSeleccionadas.includes(idDisciplina)) {
      setDisciplinasSeleccionadas(disciplinasSeleccionadas.filter((id) => id !== idDisciplina));
    } else {
      setDisciplinasSeleccionadas([...disciplinasSeleccionadas, idDisciplina]);
    }
  };

  const guardarDisciplinasEntrenador = async () => {
    if (!entrenadorSeleccionado || operacionDisciplinasId.current !== null) return;
    if (usuariosEnEliminacion.current.has(entrenadorSeleccionado.id)) return;
    operacionDisciplinasId.current = entrenadorSeleccionado.id;
    setGuardandoDisciplinas(true);
    setError('');
    setMensaje('');

    try {
      await actualizarDisciplinasEntrenador(entrenadorSeleccionado.id, disciplinasSeleccionadas);
      setMensaje(`Disciplinas actualizadas para ${entrenadorSeleccionado.nombre}`);
      setEntrenadorSeleccionado(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la operación.');
    } finally {
      operacionDisciplinasId.current = null;
      setGuardandoDisciplinas(false);
    }
  };

  const usuariosFiltrados =
    filtroRol === 'todos' ? usuarios : usuarios.filter((u) => u.rol === filtroRol);

  return (
    <div>
      <h2>Usuarios</h2>
      {cargandoDisciplinas && <p role="status">Cargando disciplinas del entrenador…</p>}
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="tarjeta">
        <div className="campos-formulario">
          <h3>{editandoId ? `Editando Usuario #${editandoId}` : 'Nuevo Usuario'}</h3>

          <div className="grilla-form">
            <div className="campo-form">
              <label>Rol:</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as 'admin' | 'cliente' | 'entrenador')}
                disabled={editandoId !== null}
              >
                <option value="cliente">Cliente</option>
                <option value="entrenador">Entrenador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="campo-form">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="campo-form">
              <label>Apellido:</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>

            <div className="campo-form">
              <label>Nombre de Usuario:</label>
              <input
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
            </div>

            <div className="campo-form">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="campo-form">
              <label>
                Contraseña {editandoId ? '(dejar vacío para no cambiar)' : '(mín. 8 caracteres)'}:
              </label>
              <input
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required={!editandoId}
              />
            </div>

            <div className="campo-form">
              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
              />
            </div>

            <div className="campo-form">
              <label>Teléfono (opcional):</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          <div className="acciones-celda">
            <button type="submit" className="btn btn-lima">
              {editandoId ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarFormulario} className="btn btn-gris">
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      {entrenadorSeleccionado && (
        <div className="tarjeta">
          <h3>
            Habilitar disciplinas para el entrenador: {entrenadorSeleccionado.nombre}{' '}
            {entrenadorSeleccionado.apellido}
          </h3>
          <p>Seleccioná las disciplinas que este entrenador puede dictar:</p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {disciplinas.map((d) => (
              <label key={d.id}>
                <input
                  type="checkbox"
                  disabled={guardandoDisciplinas}
                  checked={disciplinasSeleccionadas.includes(d.id)}
                  onChange={() => toggleDisciplinaEntrenador(d.id)}
                />{' '}
                {d.nombre}
              </label>
            ))}
          </div>
          <div className="acciones-celda">
            <button disabled={guardandoDisciplinas} onClick={guardarDisciplinasEntrenador} className="btn btn-lima">
              {guardandoDisciplinas ? 'Guardando…' : 'Guardar Disciplinas'}
            </button>
            <button disabled={guardandoDisciplinas} onClick={() => setEntrenadorSeleccionado(null)} className="btn btn-gris">
              Cerrar
            </button>
          </div>
        </div>
      )}

      <ListadoCrud
        titulo="Listado de Usuarios"
        filtros={
          <div className="campo-form" style={{ maxWidth: '300px', marginBottom: '12px' }}>
            <label>Filtrar por rol:</label>
            <select
              value={filtroRol}
              onChange={(e) =>
                setFiltroRol(e.target.value as 'todos' | 'admin' | 'cliente' | 'entrenador')
              }
            >
              <option value="todos">Todos los roles</option>
              <option value="cliente">Cliente</option>
              <option value="entrenador">Entrenador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        }
      >
        <table className="tabla-crud">
          <thead>
            <tr>
              <th>ID</th>
              <th>Rol</th>
              <th>Nombre y Apellido</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Fecha Nac.</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8}>No hay usuarios registrados.</td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.rol}</td>
                  <td className="listado-nombre">
                    {u.nombre} {u.apellido}
                  </td>
                  <td>{u.nombreUsuario}</td>
                  <td>{u.email}</td>
                  <td>{u.fechaNacimiento ? u.fechaNacimiento.slice(0, 10) : '-'}</td>
                  <td>{u.telefono || '-'}</td>
                  <td className="acciones-celda listado-acciones">
                    <AccionListado
                      accion="editar"
                      etiqueta={`Editar usuario #${u.id}`}
                      onClick={() => seleccionarParaEditar(u)}
                    >
                      Editar
                    </AccionListado>
                    {u.rol === 'entrenador' && (
                      <AccionListado
                        accion="disciplinas"
                        etiqueta={`Disciplinas usuario #${u.id}`}
                        disabled={cargandoDisciplinas || guardandoDisciplinas}
                        onClick={() => abrirDisciplinasEntrenador(u.id)}
                      >
                        Disciplinas
                      </AccionListado>
                    )}
                    <AccionListado
                      accion="eliminar"
                      etiqueta={`Eliminar usuario #${u.id}`}
                      disabled={cargandoDisciplinasId === u.id || (guardandoDisciplinas && entrenadorSeleccionado?.id === u.id)}
                      onClick={() => handleEliminar(u.id)}
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