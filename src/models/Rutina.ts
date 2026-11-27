import type { Usuario } from './Usuario';
import type { Solicitud } from './Solicitud';
import type { EjercicioRutina } from './EjercicioRutina';

export interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'activa' | 'inactiva';
  entrenador: Usuario | number;
  solicitud: Solicitud | number;
  ejerciciosRutina?: EjercicioRutina[];
}
