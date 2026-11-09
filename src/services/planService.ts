import type { Plan } from '../models/Plan';
import { peticionApi } from './api';

export async function obtenerPlanes(): Promise<Plan[]> {
  const data = await peticionApi('/planes');
  return data.data;
}

export async function crearPlan(datos: {
  nombre: string;
  precio: number;
  duracionEnMeses: number;
  incluyeClasesGrupales: boolean;
  descripcion: string;
  activo: boolean;
}) {
  return peticionApi('/planes', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarPlan(
  id: number,
  datos: {
    nombre: string;
    precio: number;
    duracionEnMeses: number;
    incluyeClasesGrupales: boolean;
    descripcion: string;
    activo: boolean;
  }
) {
  return peticionApi(`/planes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export async function eliminarPlan(id: number) {
  return peticionApi(`/planes/${id}`, {
    method: 'DELETE',
  });
}
