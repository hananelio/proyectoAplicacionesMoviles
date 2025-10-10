import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private db : AngularFirestoreCollection<Usuario>;
  
  constructor(private afs: AngularFirestore) { 
    this.db = this.afs.collection<Usuario>('usuarios');
  }

  create(usuario: Usuario): Promise<any> {
    return this.db.add(usuario);
  }

  getAll(): AngularFirestoreCollection<Usuario> {
    return this.db;
  }
}
