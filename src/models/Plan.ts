export interface Plan {
  id: number;
  nombre: string;
  precio: string | number;
  incluyeClasesGrupales: boolean;
  duracionEnMeses: number;
  descripcion: string;
  activo: boolean;
}
