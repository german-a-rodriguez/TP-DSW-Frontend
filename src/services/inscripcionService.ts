import type { Inscripcion, CrearInscripcion } from '../models/Inscripcion';
import { peticionApi } from './api';

// Obtener todas las inscripciones del usuario logueado
export async function obtenerInscripciones(): Promise<Inscripcion[]> {
  const respuesta = await peticionApi('/inscripciones');
  return respuesta.data;
}

// Inscribir un cliente a una clase
export async function crearInscripcion(datos: CrearInscripcion) {
  return peticionApi('/inscripciones', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

// Cancelar una inscripción
export async function cancelarInscripcion(
  clienteId: number,
  claseId: number,
  fechaInscripcion: string
) {
  return peticionApi(
    `/inscripciones/${clienteId}/${claseId}/${fechaInscripcion}`,
    {
      method: 'DELETE',
    }
  );
}
