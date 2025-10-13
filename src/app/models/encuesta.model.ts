import { Asignacion } from './asignacion.model';
import { Timestamp } from 'firebase/firestore';
import { Seccion } from './seccion.model';

export interface Encuesta {
    id: string; // Identificador único de la encuesta
    titulo: string;
    descripcion?: string;
    creadorId: string;        // id del diseñador (Usuario)
    fechaCreacion: Timestamp; // Fecha de creación
    fechaActualizacion?: Timestamp; // Fecha de última actualización
    fechaPublicacion?: Timestamp;   // Fecha de publicación
    fechaCierre?: Timestamp;        // Fecha de cierre
    estado: 'borrador' | 'publicada' | 'archivada';

    // Subcolecciones
    secciones?: Seccion[];
    asignaciones?: Asignacion[];
}
