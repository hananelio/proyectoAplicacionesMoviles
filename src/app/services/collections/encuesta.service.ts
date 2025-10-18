import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthRestService } from '../core/auth-rest.service';
import { Observable, map } from 'rxjs';
import { Encuesta} from '../../models/encuesta.model'
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

  private headers() : HttpHeaders {
    const token = this.auth.getToken();

    return new HttpHeaders({
      'Content-Type' : 'application/json',
      ...( token ? { Authorization : `Bearer ${token}` } : {})
    })
  }

  getAll() : Observable<Encuesta[]> {
    const url = `${this.base}/${this.collection}`;

    return this.http.get<any>(url, { headers : this.headers() }).pipe(
      map(resp => (resp.documents ?? []).map((d : any) => FirestoreMapear.encuestaFromFirestore(d)))
    );
  }

  getById(id : string) : Observable<Encuesta> {
    const url = `${this.base}/${this.collection}/${id}`;

    return this.http.get<any>(url, { headers : this.headers() }).pipe(
      map(doc => FirestoreMapear.encuestaFromFirestore(doc))
    );
  }

  create(enc : Encuesta) : Observable<Encuesta>{
    const url = `${this.base}/${this.collection}`;
    const body = FirestoreMapear.encuestaToFirestore({
      ...enc,
      fechaCreacion : enc.fechaCreacion ?? new Date().toISOString()
    });

    return this.http.post<any>(url, body, {headers : this.headers() }).pipe(
      map(doc => FirestoreMapear.encuestaFromFirestore(doc))
    );
  }

  update(id : string, partial : Partial<Encuesta>) : Observable<Encuesta> {
    const url = `${this.base}/${this.collection}/${id}`;
    const body = FirestoreMapear.encuestaToFirestore(partial as Encuesta);
    const fields = Object.keys((body as any).fields || {});
    let params = new HttpParams();
    fields.forEach(k => params = params.append('updateMask.fieldPaths', k));

    return this.http.patch<any>(url, body, { headers : this.headers(), params }).pipe(
      map(doc => FirestoreMapear.encuestaFromFirestore(doc))
    );
  }

  put(id : string, full : Encuesta) : Observable<Encuesta>{
    return this.update(id, full);
  }

  delete(id : string) : Observable<void> {
    const url = `${this.base}/${this.collection}/${id}`;
    return this.http.delete<void>(url, { headers : this.headers() });
  }
}

