import { obtenerHeaders, obtenerMensajeError } from '../utils/auth';

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
    throw new Error('No se pudo conectar con el servidor. Revisá tu conexión.');
  }

  // Si la sesión venció (401), limpiamos y avisamos
  if (response.status === 401 && endpoint !== '/login') {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    window.dispatchEvent(new Event('sesion-expirada'));
    throw new Error('Tu sesión venció. Iniciá sesión nuevamente.');
  }

  // Algunas operaciones, como una eliminación, pueden no devolver contenido.
  if (response.status === 204) return {};

  // Leemos el JSON de la respuesta y lo convertimos en un objeto JavaScript (si no es JSON, le informamos)
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('El servidor no devolvió una respuesta válida.');
  }

  if (!response.ok) {
    // Si el backend nos mandó un mensaje o lista de errores específicos, mostramos eso
    if (data.message || data.errores) {
      throw new Error(obtenerMensajeError(data));
    }

    // Mensaje por defecto para cualquier otro error
    throw new Error('No se pudo completar la solicitud. Intentá nuevamente.');
  }

  return data;
}
