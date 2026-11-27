import { obtenerHeaders, obtenerMensajeError } from '../utils/auth';
import { registrarErrorFrontend } from './errorService';

const BASE_URL = 'http://localhost:3000/api';

// Realiza peticiones al backend con el token y maneja los errores.
export async function peticionApi(
  endpoint: string,
  opciones: RequestInit = {},
) {
  // Asignamos los headers
  opciones.headers = obtenerHeaders();

  // Hacemos el fetch directo. Si el backend esta apagado o la conexión falla, lanzamos un error genérico.
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, opciones);
  } catch {
    const mensaje = 'No se pudo conectar con el servidor. Revisá tu conexión.';
    void registrarErrorFrontend({
      mensaje: `${mensaje} (${endpoint})`,
      tipoError: 'NetworkError',
    });
    throw new Error(mensaje);
  }

  // Si la sesión venció (401), limpiamos el token y recargamos para volver al login
  if (response.status === 401 && endpoint !== '/login') {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    window.location.reload();
    throw new Error('Tu sesión venció. Iniciá sesión nuevamente.');
  }

  // Algunas operaciones, como una eliminación, pueden no devolver contenido.
  if (response.status === 204) return {};

  // Leemos el JSON de la respuesta y lo convertimos en un objeto JavaScript (si no es JSON, le informamos)
  let data;
  try {
    data = await response.json();
  } catch {
    const mensaje = 'El servidor no devolvió una respuesta válida.';
    void registrarErrorFrontend({
      mensaje: `${mensaje} (${endpoint} - HTTP ${response.status})`,
      tipoError: 'InvalidJsonResponse',
    });
    throw new Error(mensaje);
  }

  if (!response.ok) {
    if (response.status >= 500) {
      void registrarErrorFrontend({
        mensaje: data?.message || `Error HTTP ${response.status} en ${endpoint}`,
        tipoError: `Http${response.status}Error`,
      });
    }

    // Si el backend nos mandó un mensaje o lista de errores específicos, mostramos eso
    if (data.message || data.errores) {
      throw new Error(obtenerMensajeError(data));
    }

    // Mensaje por defecto para cualquier otro error
    throw new Error('No se pudo completar la solicitud. Intentá nuevamente.');
  }

  return data;
}