import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/models/usuario.model';
import { FirestoreCrudService } from '../core/firestore-crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Servicio disponible en toda la aplicación
})
export class UsuarioService { // Servicio específico para la colección 'usuarios'
  private readonly path = 'usuarios'; // Ruta de la colección en Firestore
  
  constructor(private crud: FirestoreCrudService<Usuario>) { } // Constructor vacío, no se necesita inyección de dependencias
  
  // Métodos específicos para la colección 'usuarios'
  // Método GET que devuelve un Observable de un array de Usuario
  getAll(id: string): Observable<Usuario[]> { // Obtener todos los usuarios
    return this.crud.getAll(this.path); // Llama al método genérico getAll del servicio CRUD
  }

  // Método GET que devuelve un Observable de un solo Usuario por ID
  gestById(id: string): Observable<Usuario | undefined> { // Obtener un usuario por ID
    return this.crud.getById(this.path, id); // Llama al método genérico getById del servicio CRUD
  }

  // Método POST que crea un nuevo Usuario y devuelve una promesa con la referencia del documento creado
  create(data: Usuario): Promise<any> { // Crear un nuevo usuario
    return this.crud.create(this.path, data); // Llama al método genérico create del servicio CRUD
  }

  // Método PUT que actualiza un Usuario existente y devuelve una promesa
  update(id: string, data: Partial<Usuario>): Promise<void> { // Actualizar un usuario existente
    return this.crud.update(this.path, id, data); // Llama al método genérico update del servicio CRUD
  }

  // Método DELETE que elimina un Usuario por ID y devuelve una promesa
  delete(id: string): Promise<void> { // Eliminar un usuario por ID
    return this.crud.delete(this.path, id); // Llama al método genérico delete del servicio CRUD
  } // Fin de la clase UsuarioService
} // Fin del servicio
