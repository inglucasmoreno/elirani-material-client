
export interface OrdenMantenimientoMadera {
  id?: number;
  obra_madera: number;
  fecha: string;
  observaciones: string;
  precio: number | null;
  creatorUser: number;
  updatorUser: number;
}