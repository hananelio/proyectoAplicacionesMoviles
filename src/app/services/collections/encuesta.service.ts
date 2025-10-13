import { Injectable } from '@angular/core';
import { Encuesta } from 'src/app/models/encuesta.model';
import { FirestoreCrudService} from '../core/firestore-crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Servicio disponible en toda la aplicación
})

export class EncuestaService { // Servicio específico para la colección 'encuestas'
  private readonly path = 'encuestas'; // Ruta de la colección en Firestore
  
  constructor(private crud: FirestoreCrudService<Encuesta>) { } // Constructor vacío, no se necesita inyección de dependencias
  
  // Métodos específicos para la colección 'encuestas'
  getAll(): Observable<Encuesta[]> { // Obtener todas las encuestas
    return this.crud.getAll(this.path); // Llama al método genérico getAll del servicio CRUD
  }

  getById(id: string): Observable<Encuesta | undefined> { // Obtener una encuesta por ID
    return this.crud.getById(this.path, id); // Llama al método genérico getById del servicio CRUD
  }

  create(data: Encuesta): Promise<any> { // Crear una nueva encuesta
    return this.crud.create(this.path, data); // Llama al método genérico create del servicio CRUD
  }

  update(id: string, data: Partial<Encuesta>): Promise<void> { // Actualizar una encuesta existente
    return this.crud.update(this.path, id, data); // Llama al método genérico update del servicio CRUD
  }

  delete(id: string): Promise<void> { // Eliminar una encuesta por ID
    return this.crud.delete(this.path, id); // Llama al método genérico delete del servicio CRUD
  } // Fin de la clase EncuestaService
} // Fin del servicio
