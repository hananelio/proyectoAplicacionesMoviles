import { Asignacion } from './asignacion.model';
import { Pregunta } from './pregunta.model';

export interface Encuesta {
    id: string; // Identificador único de la encuesta
    titulo: string;
    descripcion?: string;
    creadorId: string;        // id del diseñador (Usuario)
    fechaCreacion: string; // Fecha de creación
    fechaActualizacion?: string; // Fecha de última actualización
    fechaPublicacion?: string;   // Fecha de publicación
    fechaCierre?: string;        // Fecha de cierre
    estado: 'borrador' | 'publicada' | 'archivada';

    // Subcolecciones
    preguntas?: Pregunta[];
    asignaciones?: Asignacion[];
}
