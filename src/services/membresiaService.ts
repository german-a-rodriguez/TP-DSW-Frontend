import type { Membresia } from '../models/Membresia';
import { peticionApi } from './api';

export async function obtenerMembresias(): Promise<Membresia[]> {
  const data = await peticionApi('/membresias');
  return data.data;
}

export async function crearMembresia(datos: { clienteId: number; planId: number }) {
  return peticionApi('/membresias', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarMembresia(
  id: number,
  datos: {
    fechaInicio: string;
    fechaFin: string;
    estadoMembresia: 'pendiente' | 'activa' | 'vencida' | 'cancelada';
  }
) {
  return peticionApi(`/membresias/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  });
}

export async function eliminarMembresia(id: number) {
  return peticionApi(`/membresias/${id}`, {
    method: 'DELETE',
  });
}

// Registra y confirma el pago de una membresía para dejarla en estado 'activa'
export async function confirmarPagoMembresia(membresiaId: number, fechaLimitePago: string) {
  const dataPago = await peticionApi('/pagos', {
    method: 'POST',
    body: JSON.stringify({
      membresiaId,
      metodoPago: 'Efectivo',
      fechaLimitePago: fechaLimitePago.slice(0, 10),
    }),
  });

  const idPago = dataPago.data.idPago;

  return peticionApi(`/pagos/${membresiaId}/${idPago}/confirmar`, {
    method: 'PATCH',
  });
}
