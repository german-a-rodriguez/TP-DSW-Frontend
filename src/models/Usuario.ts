import type { Disciplina } from './Disciplina';

export interface Usuario {
  id: number;
  rol: 'admin' | 'cliente' | 'entrenador';
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  nombreUsuario: string;
  email: string;
  telefono?: string | null;
  disciplinas?: Disciplina[];
}
