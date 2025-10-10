export interface Asignacion {
    id?: string;
    encuestaId?: string;
    usuarioId: string;
    fechaAsignacion: Date;
    estado?: 'activa' | 'completada' | 'cancelada';
}
