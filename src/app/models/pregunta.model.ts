import { Respuesta } from "./respuesta.model";

export interface Pregunta {
  id?: string;
  idEncuesta: string;
  texto: string;
  seccion?: string;
  tipo: 'texto' | 'opcion_multiple' | 'checkbox' | 'escala';
  opciones: { valor: string, esOtro?: boolean }[]; // Solo para preguntas cerradas o de opción múltiple
  obligatorio: boolean;
  orden: number;

  // 🔹 Campos para tipo escala
  valorMin?: number;         // Ejemplo: 1
  valorMax?: number;         // Ejemplo: 5
  etiquetaInicio?: string;   // Ejemplo: "Malo"
  etiquetaFin?: string;      // Ejemplo: "Excelente"

  respuestas?: Respuesta[];
  seleccion?: string | number;
  respuestasMarcadas?: { [opcion: string]: boolean }; // ✅ para checkboxes
}