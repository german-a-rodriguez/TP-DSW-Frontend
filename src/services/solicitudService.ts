import type { Solicitud } from '../models/Solicitud';
import { peticionApi } from './api';

export async function obtenerSolicitudes(estado?: string): Promise<Solicitud[]> {
  const endpoint = estado ? `/solicitudes?estado=${estado}` : '/solicitudes';
  const data = await peticionApi(endpoint);
  return data.data;
}

export async function obtenerSolicitudPorId(id: number): Promise<Solicitud> {
  const data = await peticionApi(`/solicitudes/${id}`);
  return data.data;
}

export async function crearSolicitud(datos: {
  clienteId: number;
  peso: number;
  masaMuscular: number;
  altura: number;
  objetivo: string;
  lesionesPrevias: string | null;
}) {
  return peticionApi('/solicitudes', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarSolicitud(
  id: number,
  datos: {
    peso: number;
    masaMuscular: number;
    altura: number;
    objetivo: string;
    lesionesPrevias: string | null;
    estado: 'pendiente' | 'aprobada' | 'rechazada';
  }
) {
  return peticionApi(`/solicitudes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export async function eliminarSolicitud(id: number) {
  return peticionApi(`/solicitudes/${id}`, {
    method: 'DELETE',
  });
}
