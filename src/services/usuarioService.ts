import type { Usuario } from '../models/Usuario';
import { peticionApi } from './api';

export async function obtenerUsuarios(): Promise<Usuario[]> {
  const data = await peticionApi('/usuarios');
  return data.data;
}

export async function obtenerUsuarioPorId(id: number): Promise<Usuario> {
  const data = await peticionApi(`/usuarios/${id}`);
  return data.data;
}

export async function crearUsuario(datos: Record<string, unknown>) {
  return peticionApi('/usuarios', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarUsuario(id: number, datos: Record<string, unknown>) {
  return peticionApi(`/usuarios/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  });
}

export async function eliminarUsuario(id: number) {
  return peticionApi(`/usuarios/${id}`, {
    method: 'DELETE',
  });
}

export async function actualizarDisciplinasEntrenador(
  entrenadorId: number,
  disciplinaIds: number[]
) {
  return peticionApi(`/usuarios/${entrenadorId}/disciplinas`, {
    method: 'PUT',
    body: JSON.stringify({ disciplinaIds }),
  });
}
