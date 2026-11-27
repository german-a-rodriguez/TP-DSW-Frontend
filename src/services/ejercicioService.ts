import type { Ejercicio } from '../models/Ejercicio';
import { peticionApi } from './api';

export async function obtenerEjercicios(): Promise<Ejercicio[]> {
  const data = await peticionApi('/ejercicios');
  return data.data;
}

export async function crearEjercicio(datos: {
  nombre: string;
  descripcion?: string | null;
  categoriaId: number;
}) {
  return peticionApi('/ejercicios', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarEjercicio(
  id: number,
  datos: {
    nombre?: string;
    descripcion?: string | null;
    categoriaId?: number;
  },
) {
  return peticionApi(`/ejercicios/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  });
}

export async function eliminarEjercicio(id: number) {
  return peticionApi(`/ejercicios/${id}`, {
    method: 'DELETE',
  });
}