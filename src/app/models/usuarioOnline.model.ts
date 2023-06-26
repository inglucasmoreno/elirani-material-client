export class UsuarioOnline {
    constructor(
        public userId: number,
        public usuario: string,
        public dni: string,
        public email: string,
        public nombre: string,
        public apellido: string,
        public role: string,
        public permisos: Array<string>
    ){}   
}