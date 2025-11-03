import { Opcion } from "./opcion.model";
import { Respuesta } from "./respuesta.model";

export interface Pregunta {
  id?: string;
  idEncuesta: string;
  texto: string;
  seccion?: string;
  tipo: 'texto' | 'opcion_multiple' | 'checkbox' | 'escala';
  obligatorio: boolean;
  orden: number;
  opciones?: Opcion[];
  // 🔹 Campos para tipo escala
  valorMin?: number;         // Ejemplo: 1
  valorMax?: number;         // Ejemplo: 5
  etiquetaInicio?: string;   // Ejemplo: "Malo"
  etiquetaFin?: string;      // Ejemplo: "Excelente"

  respuestas?: Respuesta[];
  seleccion?: string | number;
  respuestasMarcadas?: { [opcion: string]: boolean }; // ✅ para checkboxes
}