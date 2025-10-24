import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Encuesta } from 'src/app/models/encuesta.model';
import { EncuestaService } from '../collections/encuesta.service';

@Injectable({ providedIn: 'root' })
export class EncuestaStateService {

  private encuestasSubject = new BehaviorSubject<Encuesta[]>([]); //Mantiene un valor actual, es decir el array de la encuesta, inicialmente un conjunto vacío
  encuestas$ = this.encuestasSubject.asObservable();//Convierte el encuestasSubject en observable de solo lectura

  constructor(private encuestaService: EncuestaService) {}

  refrescar() { //Actualiza la lista completa desde el servidor
    this.encuestaService.getAll().subscribe({ //Devuelve un observable que emite las encuestas; Te suscribes para recibir esos datos.
      next: (data) => this.encuestasSubject.next(data), //Ñps datps los va guardando en encuestaSubject
      error: (err) => console.error('Error al refrescar encuestas', err)
    });
  }

  eliminarLocal(id: string) { //Elimina temporalmente en memoria una encuesta
    const actual = this.encuestasSubject.value; //Obtiene el valor actual de la lista (lo que está en memoria).
    const actualizado = actual.filter(e => e.id !== id); //Crea una nueva lista sin la encuesta eliminada (filter quita el objeto con ese id).
    this.encuestasSubject.next(actualizado); //Actualiza el BehaviorSubject con esa nueva lista.
  }
}
