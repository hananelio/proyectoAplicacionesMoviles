import { CondicionSalto } from './condicion-salto.model';

export interface SaltoPregunta {
  condicion: CondicionSalto;   // la condición que debe cumplirse
  destinoIdPregunta: string;   // id de la pregunta a la que saltar
}