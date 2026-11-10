import type { Disciplina } from '../models/Disciplina';
import { peticionApi } from './api';

export async function obtenerDisciplinas(): Promise<Disciplina[]> {
  const data = await peticionApi('/disciplinas');
  return data.data;
}

export async function crearDisciplina(datos: {
  nombre: string;
  descripcion: string | null;
}) {
  return peticionApi('/disciplinas', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarDisciplina(
  id: number,
  datos: { nombre: string; descripcion: string | null }
) {
  return peticionApi(`/disciplinas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export async function eliminarDisciplina(id: number) {
  return peticionApi(`/disciplinas/${id}`, {
    method: 'DELETE',
  });
}
