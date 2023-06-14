
export interface Usuario { 
  id: number,
  usuario: string,
  apellido: string,
  nombre: string,
  email: string,
  permisos?: Permisos[],
  dni?: string,
  role?: string,
  activo?: boolean,
  password?: string,
  createdAt?: string    
}

export interface Permisos {
  alcance: string,
  permiso: string  
}