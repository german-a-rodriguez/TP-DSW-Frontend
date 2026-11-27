import { obtenerHeaders } from '../utils/auth';

const ERRORES_URL = 'http://localhost:3000/api/errores';

export interface PayloadErrorFrontend {
  mensaje: string;
  stackTrace?: string;
  tipoError?: string;
}

// Función que hace fetch directo a http://localhost:3000/api/errores usando obtenerHeaders(), ignora silenciosamente si 
// falla el envío del log (sin lanzar error ni recursión) y solo manda POST /errores si mensaje no está vacío..

export async function registrarErrorFrontend(
  payload: PayloadErrorFrontend,
): Promise<void> {
  const mensajeLimpio = payload.mensaje?.trim();
  if (!mensajeLimpio) return;

  try {
    await fetch(ERRORES_URL, {
      method: 'POST',
      headers: obtenerHeaders(),
      body: JSON.stringify({
        mensaje: mensajeLimpio.slice(0, 2000),
        stackTrace: payload.stackTrace?.slice(0, 8000),
        tipoError: (payload.tipoError?.trim() || 'FrontendError').slice(0, 100),
      }),
    });
  } catch {
    // No relanzar para evitar bucles si el backend está caído o falla el log
  }
}