import { Pregunta } from './pregunta.model';
import { Asignacion } from './asignacion.model';

export interface Respuesta {
    id?: string;
    idPregunta?: string;
    idUsuario: string;
    respuestas: Record<string, any>;
    fechaEnvio: Date;
    estado?: 'borrador' | 'enviado';
    
}
