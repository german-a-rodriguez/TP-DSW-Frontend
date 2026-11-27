import type { DiaRutina, EjercicioRutina } from '../models/EjercicioRutina';
import { peticionApi } from './api';

export async function obtenerEjerciciosRutina(): Promise<EjercicioRutina[]> {
  const data = await peticionApi('/ejerciciosRutina');
  return data.data;
}

export async function crearEjercicioRutina(datos: {
  rutinaId: number;
  ejercicioId: number;
  dia: DiaRutina;
  orden: number;
  series: number;
  repeticiones: number;
}) {
  return peticionApi('/ejerciciosRutina', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function eliminarEjercicioRutina(id: number) {
  return peticionApi(`/ejerciciosRutina/${id}`, {
    method: 'DELETE',
  });
}
