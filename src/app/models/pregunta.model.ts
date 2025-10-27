export interface Pregunta {
  id?: string;
  idEncuesta: string;
  texto: string;
  seccion?: string;
  tipo: 'texto' | 'opcion_multiple' | 'checkbox' | 'escala';
  opciones?: string[]; // Solo para preguntas cerradas o de opción múltiple
  obligatorio: boolean;
  orden: number;

  // 🔹 Campos para tipo escala
  valorMin?: number;         // Ejemplo: 1
  valorMax?: number;         // Ejemplo: 5
  etiquetaInicio?: string;   // Ejemplo: "Malo"
  etiquetaFin?: string;      // Ejemplo: "Excelente"

  // 🔹 Respuesta seleccionada o ingresada
  respuesta?: any;
}

/*export interface PerfilEncuestado {
    nombre: string;
    nivelEducacion?: 'Primaria' | 'Secundaria' | 'Universidad' | 'Técnico' | 'Otro';
    sexo?: 'Masculino' | 'Femenino' | 'Otro';
    telefono?: string;
    email?: string;
    edad?: number;
}

export interface RespuestaEncuesta {
  idEncuesta: string;
  idUsuario?: string;
  perfil?: PerfilEncuestado;
  respuestas: Record<string, any>; // Las preguntas de la encuesta
  fechaEnvio: Date;
}*/