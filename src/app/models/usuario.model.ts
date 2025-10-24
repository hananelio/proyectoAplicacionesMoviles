export interface Usuario {
    id: string;
    uid: string; // 🆕 UID del usuario en Firebase Auth
    ci: string;
    complemento?: string;
    extension:
    'Sc' | 'Pd' | 'Bn' | 'Tj' | 'Ch' |
    'Cb' | 'Lp' | 'Or' | 'Pt';
    firstName: string;
    lastName: string;
    fechaNacimiento: string;
    fechaCreacion?: string;
    sexo?: 'hombre' | 'mujer';
    telefono: string;
    email: string;
    password: string;
    username: string;
    rol?: 'diseñador' | 'encuestador';
    estado?: 'activo' | 'inactivo';
}
