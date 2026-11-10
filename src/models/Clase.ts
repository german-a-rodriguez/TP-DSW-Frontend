export interface Clase {
  id: number;
  cupos: number;
  cuposDisponibles?: number;
  diaSemana:
    | 'lunes'
    | 'martes'
    | 'miercoles'
    | 'jueves'
    | 'viernes'
    | 'sabado'
    | 'domingo';
  horaInicio: string;
  horaFin: string;
  disciplina: {
    id: number;
    nombre: string;
  };
  entrenador: {
    id: number;
    nombre: string;
    apellido: string;
  };
}
