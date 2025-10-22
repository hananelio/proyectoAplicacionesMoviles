import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRestService } from '../core/auth-rest.service';
import { Observable, map, switchMap } from 'rxjs';
import { Encuesta} from '../../models/encuesta.model'
import { environment } from 'src/environments/environment';
import { FirestoreMapear } from 'src/app/core/helpers/firestore-mapear.helper';

@Injectable({
  providedIn: 'root'
})

export class EncuestaService {
  // https://firestore.googleapis.com/v1/projects/[PROJECT_ID]/databases/(default)/documents/[COLLECTION]
  private base = `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/(default)/documents`;
  private collection = 'encuestas';

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

  getAll() : Observable<Encuesta[]> {
    const url = `${this.base}/${this.collection}`;

    return this.headers().pipe(
      switchMap(headers =>
        this.http.get<any>(url, { headers }).pipe(
          map(resp => (resp.documents ?? []).map((d: any) => FirestoreMapear.encuestaFromFirestore(d)))
        )
      )
    );
  }

  getById(id : string) : Observable<Encuesta> {
    const url = `${this.base}/${this.collection}/${id}`;
    
    return this.headers().pipe(
      switchMap(headers =>
        this.http.get<any>(url, { headers }).pipe(
          map(doc => FirestoreMapear.encuestaFromFirestore(doc))
        )
      )
    );
  }

  create(encuesta : Encuesta) : Observable<Encuesta>{
    const url = `${this.base}/${this.collection}`;
    const body = FirestoreMapear.encuestaToFirestore({
      ...encuesta,
      fechaCreacion : encuesta.fechaCreacion ?? new Date().toISOString(),
      fechaActualizacion: encuesta.fechaActualizacion ?? new Date().toISOString()
    });
    
    return this.headers().pipe(
      switchMap(headers =>
        this.http.post<any>(url, body, { headers }).pipe(
          map(doc => FirestoreMapear.encuestaFromFirestore(doc))
        )
      )
    );
  }

  update(id : string, partial : Partial<Encuesta>) : Observable<Encuesta> {
    const url = `${this.base}/${this.collection}/${id}`;
    const body = FirestoreMapear.encuestaToFirestore( {
      ...partial,
      fechaActualizacion: new Date().toISOString()
    } as Encuesta);
    
    const fields = Object.keys((body as any).fields || {});
    let params = new HttpParams();
    fields.forEach(k => params = params.append('updateMask.fieldPaths', k));

    return this.headers().pipe(
      switchMap(headers =>
        this.http.patch<any>(url, body, { headers, params }).pipe(
          map(doc => FirestoreMapear.encuestaFromFirestore(doc))
        )
      )
    );
  }

  put(id : string, full : Encuesta) : Observable<Encuesta>{
    return this.update(id, full);
  }

  delete(id : string) : Observable<void> {
    const url = `${this.base}/${this.collection}/${id}`;
    
    return this.headers().pipe(
      switchMap(headers => this.http.delete<void>(url, { headers }))
    );
  }
}