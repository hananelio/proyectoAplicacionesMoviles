import { Injectable } from '@angular/core';
import { FirestoreCrudService } from '../core/firestore-crud.service';
import { Seccion } from 'src/app/models/seccion.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Servicio disponible en toda la aplicación
})

export class SeccionService {
  private readonly path = 'secciones'; // Ruta de la colección en Firestore
  
  constructor(private crud: FirestoreCrudService<Seccion>) { } // Constructor vacío, no se necesita inyección de dependencias
  
  // Métodos específicos para la colección 'secciones'
  // Método GET que devuelve un Observable de un array de Seccion
  getAll(): Observable<Seccion[]> { // Obtener todas las secciones
    return this.crud.getAll(this.path); // Llama al método genérico getAll del servicio CRUD
  }

  // Método GET que devuelve un Observable de un solo Seccion por ID
  getById(id: string): Observable<Seccion | undefined> { // Obtener una sección por ID
    return this.crud.getById(this.path, id); // Llama al método genérico getById del servicio CRUD
  }

  // Método POST que crea un nuevo Seccion y devuelve una promesa con la referencia del documento creado
  create(data: Seccion): Promise<any> { // Crear una nueva sección
    return this.crud.create(this.path, data); // Llama al método genérico create del servicio CRUD
  }

  // Método PUT que actualiza un Seccion existente y devuelve una promesa
  update(id: string, data: Partial<Seccion>): Promise<void> { // Actualizar una sección existente
    return this.crud.update(this.path, id, data); // Llama al método genérico update del servicio CRUD
  }

  // Método DELETE que elimina un Seccion por ID y devuelve una promesa
  delete(id: string): Promise<void> { // Eliminar una sección por ID
    return this.crud.delete(this.path, id); // Llama al método genérico delete del servicio CRUD
  }
}
