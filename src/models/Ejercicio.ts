import type { Categoria } from './Categoria';

export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion?: string | null;
  categoria: Categoria | number;
}