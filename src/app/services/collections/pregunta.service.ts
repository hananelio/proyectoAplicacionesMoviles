import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthRestService } from '../core/auth-rest.service';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { Pregunta } from 'src/app/models/pregunta.model';
import { FirestoreMapear } from 'src/app/core/helpers/firestore-mapear.helper';

@Injectable({
  providedIn: 'root' //Disponibilidad del servicio en toda la app
})
export class PreguntaService { //Clase Principal
  private base = `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/(default)/documents`; //URL base de la API REST de Firestore.
  private parent = 'encuestas'; //Colección padre
  private collection = 'preguntas'; //Subcolección pregunta

  constructor( //Constructor con dependencias
    private http: HttpClient, //hace las peticiones HTTP
    private auth: AuthRestService //obtiene el token de autenticación (Bearer token)
  )  { }
  /** Obtiene los encabezados de autenticación */
  private headers() {
    return this.auth.getToken().pipe(//Obtiene el Token mediante authRest
      map(token => new HttpHeaders({ //Devuelve un Observable con los encabezados HTTP
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }))
    );
  }
  /**Obtener todas pas preguntas de una encuesta */
  getAll(idEncuesta: string): Observable<Pregunta[]> { //observable con un array de preguntas
    const url = `${this.base}/${this.parent}/${idEncuesta}/${this.collection}`;//RL completa de la subcolección de preguntas dentro de una encuesta específica
    return this.headers().pipe(//Obtiene los encabezados
      switchMap(headers => //Espera los encabezados antes de hacer la llamada HTTP
        this.http.get<any>(url, { headers }).pipe( //Petición get para obtener los documentos de Preguntas
          map(resp => (resp.documents ?? []) //transforma la respuesta:
            .map((d: any) => FirestoreMapear.preguntaFromFirestore(d))), //convierte cada documento Firestore al modelo Pregunta
        )
      )
    );
  }
  /**Crear una nueva encuesta */
  create(pregunta: Pregunta): Observable<Pregunta>{ //
    if(!pregunta.idEncuesta) return throwError(() => new Error('La pregunta debe pertenecer a una encuesta')); //verifica que la pregunta tenga idEncuesta

    const url = `${this.base}/${this.parent}/${pregunta.idEncuesta}/${this.collection}`; //Arma URL
    const body = FirestoreMapear.preguntaToFirestore(pregunta); //Convierte la pregunta en formato Firestore

    return this.headers().pipe( // retorna los encabezados
      switchMap(headers => 
        this.http.post<any>(url, body, { headers }).pipe( //Post para crear la pregunta
          map(res => {
            const id = res.name.split('/').pop();//extrae el id generado
            return { ...pregunta, id };//devuelve la pregunta con el id genrado
          })
        )
      )
    )
  };
  /**Actualizar una pregunta existente */
  update(idEncuesta: string, idPregunta: string, partial: Partial<Pregunta>): Observable<Pregunta> {
    const url = `${this.base}/${this.parent}/${idEncuesta}/${this.collection}/${idPregunta}`; //crea la url
    
    const body = { fields: {} as any };
    Object.keys(partial).forEach(k => {
      const value = (partial as any)[k];
      
      if(typeof value === 'string') body.fields[k] = { stringValue: value };
      else if(typeof value === 'number') body.fields[k] = { stringValue: value };
      else if(typeof value === 'boolean') body.fields[k] = { stringVakue: value };
      /*else if(Array.isArray(value)) {
        body.fields[k] = { 
          arrayValue: { values: value.map(v => ({ stringValue: v })) } 
        };
      } else if(value === null || value === undefined) {
        body.fields[k] = { nullValue : null};
      }*/
      else if (value instanceof Array) {
        body.fields[k] = { arrayValue: { values: value.map(v => ({ stringValue: v })) } };
      }
    });

    //const body = FirestoreMapear.preguntaToFirestore(partial as Pregunta);//convierte los datos a formato firestore


    let params = new HttpParams();
    Object.keys(partial).forEach(k => {
      params = params.append('updateMask.fieldPaths', k)
    });
    /*const params = new HttpParams() //define los campos a actualizar
      .set('updateMask.fieldPaths', 'texto')
      .append('updateMask.fieldPaths', 'seccion')
      .append('updateMask.fieldPaths', 'tipo')
      .append('updateMask.fieldPaths', 'opciones')
      .append('updateMask.fieldPaths', 'obligatorio')
      .append('updateMask.fieldPaths', 'orden');*/

    //return this.http.patch<Pregunta>(url, body, { params });
    return this.headers().pipe(
      switchMap(headers => 
        this.http.patch<any>(url, body, { headers, params }) //Hacer patch con esos campos
          .pipe(map(doc => FirestoreMapear.preguntaFromFirestore(doc))) //Convierte la respuesta de Firestore de nuevo a Pregunta
      )
    )
  }
  /**Eliminar una pregunta */
  delete(idEncuesta: string, idPregunta: string): Observable<void>{
    const url = `${this.base}/${this.parent}/${idEncuesta}/${this.collection}/${idPregunta}`; //Construye la URL exacta del documento a eliminar.
    return this.headers().pipe( //Obtiene las cabeceras de autenticación.
      switchMap(headers =>this.http.delete<void>(url, { headers })) //Hace un DELETE a Firestore.
    ) //Devuelve un observable void (sin valor, solo indica éxito o error).
  }
}
