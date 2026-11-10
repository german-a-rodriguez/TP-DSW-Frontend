import type { Usuario } from './Usuario';
import type { Plan } from './Plan';

export interface Membresia {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estadoMembresia: 'pendiente' | 'activa' | 'vencida' | 'cancelada';
  cliente: Usuario | number;
  plan: Plan | number;
}
