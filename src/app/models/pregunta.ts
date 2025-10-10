export interface Pregunta {
    id?: string;
    encuestaId?: string;
    texto: string;
    tipo: 'texto' | 'opcion_multiple' | 'checkbox' | 'escala';
    opciones?: string[]; // Solo para preguntas cerradas o de opción múltiple
    obligatorio: boolean;
    orden: number;
}
