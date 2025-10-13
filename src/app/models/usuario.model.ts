export interface Usuario {
    id?: string;
    ci: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    username: string;
    rol?: 'diseñador' | 'encuestador';
    estado?: 'activo' | 'inactivo';
}
