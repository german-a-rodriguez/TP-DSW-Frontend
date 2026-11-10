import type { Clase } from '../models/Clase';
import { peticionApi } from './api';

export async function obtenerClases(disciplinaId?: string): Promise<Clase[]> {
  const endpoint = disciplinaId ? `/clases?disciplinaId=${disciplinaId}` : '/clases';
  const data = await peticionApi(endpoint);
  return data.data;
}

export async function obtenerClasePorId(id: number): Promise<Clase> {
  const data = await peticionApi(`/clases/${id}`);
  return data.data;
}

export async function crearClase(datos: {
  disciplinaId: number;
  entrenadorId: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupos: number;
}) {
  return peticionApi('/clases', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarClase(
  id: number,
  datos: {
    disciplinaId: number;
    entrenadorId: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    cupos: number;
  }
) {
  return peticionApi(`/clases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export async function eliminarClase(id: number) {
  return peticionApi(`/clases/${id}`, {
    method: 'DELETE',
  });
}
