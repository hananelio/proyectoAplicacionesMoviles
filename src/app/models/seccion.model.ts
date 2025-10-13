import { Pregunta } from "./pregunta.model";

export interface Seccion {
    id?: string;
    titulo: string;
    descripcion?: string;
    orden: number;
    preguntas: Pregunta[];
}
