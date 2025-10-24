import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../collections/usuario.service';

@Injectable({ providedIn: 'root' })
export class UsuarioStateService {

  private usuariosSubject = new BehaviorSubject<Usuario[]>([]); //Mantiene un valor actual, es decir el array de la encuesta, inicialmente un conjunto vacío
  usuarios$ = this.usuariosSubject.asObservable();//Convierte el encuestasSubject en observable de solo lectura

  constructor(private usuarioService: UsuarioService) {}

  refrescar() { //Actualiza la lista completa desde el servidor
    this.usuarioService.getAll().subscribe({ //Devuelve un observable que emite las encuestas; Te suscribes para recibir esos datos.
      next: (data) => this.usuariosSubject.next(data), //Ñps datps los va guardando en encuestaSubject
      error: (err) => console.error('Error al refrescar usuarios', err)
    });
  }

  eliminarLocal(id: string) { //Elimina temporalmente en memoria una encuesta
    const actual = this.usuariosSubject.value; //Obtiene el valor actual de la lista (lo que está en memoria).
    const actualizado = actual.filter(e => e.id !== id); //Crea una nueva lista sin la encuesta eliminada (filter quita el objeto con ese id).
    this.usuariosSubject.next(actualizado); //Actualiza el BehaviorSubject con esa nueva lista.
  }
}
