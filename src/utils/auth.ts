// Decodificador del Token (src/utils/auth.ts)
// Esta función toma el token JWT, lo lee y te devuelve el objeto con los datos
// (incluyendo el id, nombre y rol) sin necesidad de instalar paquetes externos:
export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Devuelve los datos del usuario logueado leyendo el token guardado en localStorage
export function obtenerUsuarioLogueado(): {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
} | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return parseJwt(token);
}

// Arma los headers básicos para enviar en cada fetch al backend incluyendo el token JWT
export function obtenerHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

// Une los mensajes de error cuando el backend devuelve { message, errores: [...] }
export function obtenerMensajeError(data: {
  message?: string;
  errores?: string[];
}) {
  if (data && Array.isArray(data.errores) && data.errores.length > 0) {
    return data.errores.join(' | ');
  }
  return data?.message || 'Ocurrió un error en el servidor';
}
