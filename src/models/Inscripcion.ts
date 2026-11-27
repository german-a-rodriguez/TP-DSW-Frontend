export type EstadoInscripcion = 'activa' | 'finalizada';

export interface Inscripcion {
  cliente: {
    id: number;
  };
  clase: {
    id: number;
  };
  fechaInscripcion: string;
  estadoInscripcion: EstadoInscripcion;
}

export interface CrearInscripcion {
  clienteId: number;
  claseId: number;
}