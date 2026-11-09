import type { Usuario } from './Usuario';
import type { Solicitud } from './Solicitud';

export interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'activa' | 'inactiva';
  entrenador: Usuario | number;
  solicitud: Solicitud | number;
}
