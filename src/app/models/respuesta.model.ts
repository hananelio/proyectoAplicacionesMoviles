import { Pregunta } from './pregunta.model';
import { Asignacion } from './asignacion.model';

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
