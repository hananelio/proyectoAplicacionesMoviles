import { Injectable } from '@angular/core';
import { 
  Firestore, // Importar Firestore de AngularFire
  collection, // Función para obtener una referencia a una colección
  collectionData, // Función para obtener los datos de una colección como Observable
  doc, // Función para obtener una referencia a un documento
  docData, // Función para obtener los datos de un documento como Observable
  addDoc, // Función para agregar un documento a una colección
  updateDoc, // Función para actualizar un documento
  deleteDoc, // Función para eliminar un documento
  DocumentReference // Tipo para la referencia de un documento
} from '@angular/fire/firestore';
import { Observable } from 'rxjs'; // Importar Observable de RxJS

@Injectable({
  providedIn: 'root' // Servicio disponible en toda la aplicación
})

export class FirestoreCrudService<T> { // Servicio genérico para CRUD en Firestore
  constructor(private firestore: Firestore) { } // Inyección de dependencia de Firestore

  // Métodos CRUD genéricos
  // Método GET que devuelve un Observable de un array de T
  getAll(path: string): Observable<T[]> { // Obtener todos los documentos de una colección
    const ref = collection(this.firestore, path); // Referencia a la colección
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>; // Devuelve un Observable con los datos de la colección, incluyendo el campo 'id'
  }

  // Método GET que devuelve un Observable de un solo T por ID
  getById(path: string, id: string): Observable<T | undefined> { // Obtener un documento por ID
    const ref = doc(this.firestore, `${path}/${id}`); // Referencia al documento por su ID y la ruta de la colección
    return docData(ref, { idField: 'id' }) as Observable<T | undefined>; // Devuelve un Observable con los datos del documento, incluyendo el campo 'id'
  } 
  
  // Método POST que crea un nuevo documento y devuelve una promesa con la referencia del documento creado
  async create(path: string, data: T): Promise<DocumentReference> { // Crear un nuevo documento en la colección
    const ref = collection(this.firestore, path); // Referencia a la colección
    return await addDoc(ref, data as any); // Agrega el documento y devuelve la referencia del documento creado
  }
  
  // Método PUT que actualiza un documento existente y devuelve una promesa
  async update(path: string, id: string, data: Partial<T>): Promise<void> { // Actualizar un documento existente
    const ref = doc(this.firestore, `${path}/${id}`); // Referencia al documento por su ID y la ruta de la colección
    return await updateDoc(ref, data as any); // Actualiza el documento con los datos proporcionados
  }

  // Método DELETE que elimina un documento por ID y devuelve una promesa
  async delete(path: string, id: string): Promise<void> { // Eliminar un documento por ID
    const ref = doc(this.firestore, `${path}/${id}`); // Referencia al documento por su ID y la ruta de la colección
    return await deleteDoc(ref); // Elimina el documento
  } // Fin de la clase FirebaseCrudService
} // Fin del servicio


