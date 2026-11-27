import type { Categoria } from '../models/Categoria';
import { peticionApi } from './api';

export async function obtenerCategorias(): Promise<Categoria[]> {
  const data = await peticionApi('/categorias');
  return data.data;
}

export async function crearCategoria(datos: { nombre: string }) {
  return peticionApi('/categorias', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export async function modificarCategoria(id: number, datos: { nombre: string }) {
  return peticionApi(`/categorias/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  });
}

export async function eliminarCategoria(id: number) {
  return peticionApi(`/categorias/${id}`, {
    method: 'DELETE',
  });
}