import { CondicionSalto } from './condicion-salto';

export interface SaltoPregunta {
  condicion: CondicionSalto;   // la condición que debe cumplirse
  destinoPreguntaId: string;   // id de la pregunta a la que saltar
}