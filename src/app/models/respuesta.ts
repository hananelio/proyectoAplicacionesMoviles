import { Pregunta } from './pregunta';
import { Asignacion } from './asignacion';

export interface Respuesta {
    id?: string;
    encuestaId?: string;
    usuarioId: string;
    respuestas: Record<string, any>;
    fechaEnvio: Date;
    estado?: 'borrador' | 'enviado';
    
    // Subcolecciones opcionales (si las obtienes anidadas)
    preguntas?: Pregunta[];
    asignaciones?: Asignacion[];
}
