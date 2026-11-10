import { peticionApi } from './api';

export async function loginUsuario(email: string, contrasenia: string): Promise<string> {
  const data = await peticionApi('/login', {
    method: 'POST',
    body: JSON.stringify({ email, contrasenia }),
  });

  // Devuelve el token JWT
  return data.data;
}

export async function registrarCliente(datos: {
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  telefono: string;
  fechaNacimiento: string;
  nombreUsuario: string;
}) {
  return peticionApi('/registro', {
    method: 'POST',
    body: JSON.stringify({
      ...datos,
      rol: 'cliente',
    }),
  });
}
