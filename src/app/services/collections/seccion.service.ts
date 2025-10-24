import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRestService } from '../core/auth-rest.service';
import { Observable, map, switchMap } from 'rxjs';
import { Seccion} from '../../models/seccion.model'
import { environment } from 'src/environments/environment';
import { FirestoreMapear } from 'src/app/core/helpers/firestore-mapear.helper';

@Injectable({
  providedIn: 'root'
})

export class SeccionService {
  // https://firestore.googleapis.com/v1/projects/[PROJECT_ID]/databases/(default)/documents/[COLLECTION]
  private base = `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/(default)/documents`;
  private collection = 'secciones';

  constructor(
    private  http : HttpClient,
    private auth : AuthRestService
  ){ }

  // ✅ Esta función genera los headers luego de obtener el token válido
  private headers() {
    return this.auth.getToken().pipe(
      map(token => new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }))
    );
  }

  getAll() : Observable<Seccion[]> {
    const url = `${this.base}/${this.collection}`;

    return this.headers().pipe(
      switchMap(headers =>
        this.http.get<any>(url, { headers }).pipe(
          map(resp => (resp.documents ?? []).map((d: any) => FirestoreMapear.encuestaFromFirestore(d)))
        )
      )
    );
  }

  getById(id : string) : Observable<Seccion> {
    const url = `${this.base}/${this.collection}/${id}`;
    
    return this.headers().pipe(
      switchMap(headers =>
        this.http.get<any>(url, { headers }).pipe(
          map(doc => FirestoreMapear.seccionFromFirestore(doc))
        )
      )
    );
  }

  create(seccion : Seccion) : Observable<Seccion>{
    const url = `${this.base}/${this.collection}`;
    const body = FirestoreMapear.seccionToFirestore(seccion);
    
    return this.headers().pipe(
      switchMap(headers =>
        this.http.post<any>(url, body, { headers }).pipe(
          map(doc => FirestoreMapear.seccionFromFirestore(doc))
        )
      )
    );
  }

  update(id : string, partial : Partial<Seccion>) : Observable<Seccion> {
    const url = `${this.base}/${this.collection}/${id}`;
    const body = FirestoreMapear.seccionToFirestore( {
      ...partial,
      fechaActualizacion: new Date().toISOString()
    } as Seccion);
    
    const fields = Object.keys((body as any).fields || {});
    let params = new HttpParams();
    fields.forEach(k => params = params.append('updateMask.fieldPaths', k));

    return this.headers().pipe(
      switchMap(headers =>
        this.http.patch<any>(url, body, { headers, params }).pipe(
          map(doc => FirestoreMapear.seccionFromFirestore(doc))
        )
      )
    );
  }

  put(id : string, full : Seccion) : Observable<Seccion>{
    return this.update(id, full);
  }

  delete(id : string) : Observable<void> {
    const url = `${this.base}/${this.collection}/${id}`;
    
    return this.headers().pipe(
      switchMap(headers => this.http.delete<void>(url, { headers }))
    );
  }
}