import { Pregunta } from "./pregunta";

export interface Seccion {
    id?: string;
    titulo: string;
    descripcion?: string;
    orden: number;
    preguntas: Pregunta[];
}
