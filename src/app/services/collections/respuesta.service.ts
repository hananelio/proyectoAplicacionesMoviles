import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Respuesta } from 'src/app/models/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {
  constructor(private firestore: Firestore) {}

  async guardarRespuesta(respuesta: Respuesta) {
    try {
      const respuestasRef = collection(this.firestore, 'respuestas'); // o ruta a subcolección
      await addDoc(respuestasRef, {
        idPregunta: respuesta.idPregunta ?? '',
        idUsuario: respuesta.idUsuario,
        respuestas: respuesta.respuestas,
        fechaEnvio: serverTimestamp(),
        estado: respuesta.estado ?? 'borrador'
      });
      console.log('Respuesta guardada correctamente');
    } catch (error) {
      console.error('Error guardando respuesta:', error);
    }
  }
}

