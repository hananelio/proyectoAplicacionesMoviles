import { Injectable, inject } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Observable, map, switchMap, from, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthRestService } from '../core/auth-rest.service';
import { FirestoreMapear } from 'src/app/core/helpers/firestore-mapear.helper';
import { /*getAuth*/Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { deleteUser, UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private base = `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/(default)/documents`;
  private collection = 'usuarios';
  private auth = inject(Auth); // <-- inyectamos AngularFire Auth
  
  constructor(
    private  http : HttpClient,
    private authRest : AuthRestService
  ) { }

  private headers() {
    return this.authRest.getToken().pipe(
      map(token => new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }))
    );
  }
  
  getAll() : Observable<Usuario[]> {
    const url = `${this.base}/${this.collection}`;

    return this.headers().pipe(
      switchMap(headers =>
        this.http.get<any>(url, { headers }).pipe(
          map(resp => (resp.documents ?? []).map((d: any) => FirestoreMapear.usuarioFromFirestore(d)))
        )
      )
    );
  }

  getById(id : string) : Observable<Usuario> {
    const url = `${this.base}/${this.collection}/${id}`;
    
    return this.headers().pipe(
      switchMap(headers =>
        this.http.get<any>(url, { headers }).pipe(
          map(doc => FirestoreMapear.usuarioFromFirestore(doc))
        )
      )
    );
  }

  create(usuario : Usuario) : Observable<Usuario>{
    const url = `${this.base}/${this.collection}`;
    
    // normalizar fecha a YYYY-MM-DD si no viene
    usuario.fechaCreacion = usuario.fechaCreacion ?? new Date().toISOString();
    usuario.fechaNacimiento = usuario.fechaNacimiento ?? new Date().toISOString().split('T')[0];
    /*const body = FirestoreMapear.usuarioToFirestore({
      ...usuario,
      fechaNacimiento : usuario.fechaNacimiento ?? new Date().toISOString().split('T')[0]
    });*/

    return this.generarUsername(usuario.firstName,usuario.lastName).pipe(
      switchMap(username => {
        usuario.username = username;
        usuario.password = `${usuario.ci}${usuario.extension ?? ''}*`;

        //const auth = getAuth();
        //const body = FirestoreMapear.usuarioToFirestore(usuario);

        //Crear usuario en Firebase Auth
        return from(createUserWithEmailAndPassword(this.auth, usuario.email, usuario.password)).pipe(
          switchMap((userCredential: UserCredential) =>{
            
            usuario.uid = userCredential.user.uid;

            const body = FirestoreMapear.usuarioToFirestore(usuario);
            return this.headers().pipe(
              switchMap(headers =>
                this.http.post<any>(url,body, { headers }).pipe(
                  map(doc => FirestoreMapear.usuarioFromFirestore(doc))
                )
              )
            );
          }),
          catchError(err => {
            if(err.code == 'auth/email-already-in-use') {
              throw new Error('El correo ya está registrado');
            }
            throw err;
          })
        );
      })
    );
  }

   /** Actualizar parcialmente un usuario */
  update(id : string, partial : Partial<Usuario>) : Observable<Usuario> {
    const url = `${this.base}/${this.collection}/${id}`;
    const body = FirestoreMapear.usuarioToFirestore( partial as Usuario);
    
    // Crear updateMask con los campos que se van a modificar
    const fields = Object.keys((body as any).fields || {});
    let params = new HttpParams();
    fields.forEach(k => params = params.append('updateMask.fieldPaths', k));

    return this.headers().pipe(
      switchMap(headers =>
        this.http.patch<any>(url, body, { headers, params }).pipe(
          map(doc => FirestoreMapear.usuarioFromFirestore(doc))
        )
      )
    );
  }

  /** Reemplazar un usuario completo */
  put(id : string, full : Usuario) : Observable<Usuario>{
    return this.update(id, full);
  }

   /** Eliminar usuario */
  delete(id : string) : Observable<void> {
    const url = `${this.base}/${this.collection}/${id}`;
    
    return this.headers().pipe(
      switchMap(headers => this.http.delete<void>(url, { headers }))
    );
  }

  // pequeña función util para normalizar acentos y caracteres
  private normalizeStr(s: string) {
    return s
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // quita diacríticos
      .replace(/[^a-zA-Z0-9]/g, '') // quita caracteres no alfanuméricos
      .toLowerCase();
  }

  generarUsername(firstName: string, lastName: string): Observable<string> {
    const primerApellido = (lastName || '').trim().split(' ')[0] || '';
    const baseUsername = this.normalizeStr((firstName[0] || '') + primerApellido);

    const url = `${this.base}/${this.collection}?pageSize=1000`;

    return this.headers().pipe(
      switchMap(headers =>
        this.http.get<any>(url,{ headers }).pipe(
          map(resp => {
            const usuarios: string[] = (resp.documents ?? []).map((d: any)=>{
              const u = FirestoreMapear.usuarioFromFirestore(d);
              return (u.username ?? '').toLowerCase();
            });

            if(!usuarios.includes(baseUsername)) return baseUsername;

            let i = 2;
            while(usuarios.includes(baseUsername + i)) {
              i++;
            }
            return baseUsername + i;
          })
        )
      )
    )
  }

  deleteUsuario(uid: string): Observable<void> {
    console.log(uid);
    const url = `http://localhost:3000/${this.collection}/${uid}`; // cambia si está en otro servidor
    return this.http.delete<void>(url);
  }

  deleteCompleto(usuario: Usuario): Observable<void> {
    if(!usuario.uid) return throwError (() => new Error('UID no definido'));

    return this.deleteUsuario(usuario.uid).pipe (
      switchMap(() => {
        return this.delete(usuario.id);
      })
    );
  }

  /** Eliminación lógica: pone al usuario como inactivo */
  deleteLogico(id: string): Observable<Usuario> {
    const url = `${this.base}/${this.collection}/${id}`;

    const body = {
      fields: {
        estado: { stringValue: 'inactivo' }
      }
    };

    // Crear updateMask para solo modificar `estado`
    const params = new HttpParams().append('updateMask.fieldPaths', 'estado');

    return this.headers().pipe(
      switchMap(headers =>
        this.http.patch<any>(url, body, { headers, params }).pipe(
          map(doc => FirestoreMapear.usuarioFromFirestore(doc))
        )
      )
    );
  }

  /** Inhabilitar usuario en Auth */
  inhabilitarCuenta(uid: string): Observable<void> {
    const url = `http://localhost:3000/${this.collection}/inhabilitar/${uid}`;
    return this.http.patch<void>(url, {}); // solo llama el endpoint que inhabilita
  }

  deleteLogicoCompleto(usuario: Usuario): Observable<void> {
    if(!usuario.uid)
      return throwError (() => new Error('UID no definido'));

    return this.inhabilitarCuenta(usuario.uid).pipe (
      switchMap(() =>
        this.deleteLogico(usuario.id)),
      map(() => void 0)
    );
  }

  /** Activar usuario: solo actualiza el estado a 'activo' */
  activarUsuario(id: string): Observable<Usuario> {
    const url = `${this.base}/${this.collection}/${id}`;

    const body = {
      fields: {
        estado: { stringValue: 'activo' }
      }
    };

    const params = new HttpParams().append('updateMask.fieldPaths', 'estado');

    return this.headers().pipe(
      switchMap(headers =>
        this.http.patch<any>(url, body, { headers, params }).pipe(
          map(doc => FirestoreMapear.usuarioFromFirestore(doc))
        )
      )
    );
  }

  /** Habilitar usuario en Auth */
  habilitarCuenta(uid: string): Observable<void> { 
    const url = `http://localhost:3000/${this.collection}/habilitar/${uid}`; // endpoint de activación en tu backend
    return this.http.patch<void>(url, {}); // solo llama el endpoint que activa
  }

  habilitacionCompleta(usuario: Usuario): Observable<void> {
    if(!usuario.uid)
      return throwError (() => new Error('UID no definido'));

    return this.habilitarCuenta(usuario.uid).pipe (
      switchMap(() =>
        this.activarUsuario(usuario.id)),
      map(() => void 0)
    );
  }

}

