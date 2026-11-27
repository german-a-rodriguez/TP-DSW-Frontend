import type { Ejercicio } from './Ejercicio';
import type { Rutina } from './Rutina';

export type DiaRutina = 'A' | 'B' | 'C' | 'D';

export interface EjercicioRutina {
  id: number;
  repeticiones: number;
  series: number;
  dia: DiaRutina;
  orden: number;
  rutina: Rutina | number;
  ejercicio: Ejercicio | number;
}