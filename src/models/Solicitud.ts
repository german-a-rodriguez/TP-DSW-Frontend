export interface Solicitud {
  id: number;
  fechaSolicitud: string;
  peso: number;
  masaMuscular: number;
  altura: number;
  objetivo: string;
  lesionesPrevias?: string | null;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  cliente: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
}
