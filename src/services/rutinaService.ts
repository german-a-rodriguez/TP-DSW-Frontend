import type { Rutina } from '../models/Rutina';
import { peticionApi } from './api';

export async function obtenerRutinas(): Promise<Rutina[]> {
  const data = await peticionApi('/rutinas');
  return data.data;
}

export async function crearRutina(datos: {
  nombre: string;
  descripcion: string;
  estado: 'activa' | 'inactiva';
  solicitudId: number;
  entrenadorId: number;
}) {
  return peticionApi('/rutinas', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarRutina(
  id: number,
  datos: {
    nombre: string;
    descripcion: string;
    estado: 'activa' | 'inactiva';
  }
) {
  return peticionApi(`/rutinas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  });
}

export async function eliminarRutina(id: number) {
  return peticionApi(`/rutinas/${id}`, {
    method: 'DELETE',
  });
}
