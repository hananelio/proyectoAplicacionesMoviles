import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { Pregunta } from 'src/app/models/pregunta.model';
import { PreguntaService } from 'src/app/services/collections/pregunta.service';
import { CommonModule, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pregunta-item',
  templateUrl: './pregunta-item.component.html',
  styleUrls: ['./pregunta-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonicModule, FormsModule, ReactiveFormsModule
]
})
export class PreguntaItemComponent {
  @Input() pregunta!: Pregunta;
  @Output() agregarDebajo = new EventEmitter<void>();
  @Output() activarEdicion = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<Pregunta>();
  @Input() editandoEncuesta: boolean = false; // true si la encuesta está en edición general
  @Output() salirEdicion = new EventEmitter<void>();
  @Input() editandoTexto: boolean = false;

  editandoTipo = false;
  escala: number[] = [];
  private clickListener!: any;

  tiposPregunta = ['texto', 'opcion_multiple', 'checkbox', 'escala'];

  constructor(
    private preguntaService: PreguntaService,
    private http: HttpClient,
    private el: ElementRef
  ) {}

  ngOnInit() {
    // Detectar clic fuera del componente
    this.clickListener = (event: Event) => {
      //if (this.editandoTexto && !this.el.nativeElement.contains(event.target))
      if (!this.el.nativeElement.contains(event.target)) {
        this.editandoTexto = false;
        this.editandoTipo = false;
        this.salirEdicion.emit();
      }
    };
    document.addEventListener('click', this.clickListener);
  }

  ngOnDestroy() {
    // Limpiar listener al destruir el componente
    document.removeEventListener('click', this.clickListener);
  }

  borrarSeleccion() {
    this.pregunta.respuesta = null;
  }

  /** Guardar texto editado */
  guardarTexto() {
    if (!this.editandoEncuesta) return;
    this.editandoTexto = false;

    if(this.pregunta?.id && this.pregunta?.idEncuesta) {
      this.preguntaService.update(
        this.pregunta.idEncuesta,
        this.pregunta.id,
        { texto: this.pregunta.texto }
      ).subscribe();
    }
  }

  /** Guardar tipo editado */
  guardarTipo() {
    if (!this.editandoEncuesta) return;
    this.editandoTipo = false;

    if(this.pregunta?.id && this.pregunta?.idEncuesta) {
      this.preguntaService.update(
        this.pregunta.idEncuesta,
        this.pregunta.id,
        { tipo: this.pregunta.tipo }
      ).subscribe();
    }
  }

  /** Toggle edición de texto */
  toggleTexto() {
    if (!this.editandoEncuesta) return;
    this.editandoTexto = true;
    this.editandoTipo = false;
  }

  /** Toggle edición de tipo */
  toggleTipo() {
    if (!this.editandoEncuesta) return;
    this.editandoTipo = true;
    this.editandoTexto = false;
  }

  eliminarPregunta() {
    this.eliminar.emit(this.pregunta);
  }

  onSeleccionarRespuesta(valor: any) {
    if (!this.editandoEncuesta) return;
    this.pregunta.respuesta = valor;

    if (this.pregunta?.id && this.pregunta?.idEncuesta) {
      const url = `https://firestore.googleapis.com/v1/projects/appencuestabd/databases/(default)/documents/${this.pregunta.idEncuesta}/preguntas/${this.pregunta.id}?updateMask.fieldPaths=respuesta`;

      // 🔧 Construimos el body con el tipo correcto según el valor
      const body: any = {
        fields: {
          respuesta: {}
        }
      };

      if (typeof valor === 'number') {
        body.fields.respuesta.integerValue = valor.toString();
      } else if (typeof valor === 'boolean') {
        body.fields.respuesta.booleanValue = valor;
      } else {
        body.fields.respuesta.stringValue = valor.toString();
      }

      this.http.patch(url, body).subscribe({
        next: (res) => {
          console.log('✅ Respuesta actualizada correctamente en Firestore', res);
        },
        error: (err) => {
          console.error('❌ Error al actualizar respuesta', err);
        }
      });
    }
  }

  actualizarEscala() {
    if (!this.editandoEncuesta) return;
    this.generarEscala(); // 🔁 Actualiza inmediatamente en pantalla

    const url = `https://firestore.googleapis.com/v1/projects/appencuestabd/databases/(default)/documents/preguntas/${this.pregunta.id}?updateMask.fieldPaths=valorMin&updateMask.fieldPaths=valorMax`;

    const body = {
      fields: {
        valorMin: { integerValue: this.pregunta.valorMin?.toString() || '1' },
        valorMax: { integerValue: this.pregunta.valorMax?.toString() || '5' }
      }
    };

    this.http.patch(url, body).subscribe({
      next: (res) => {
        console.log('✅ Escala actualizada correctamente en Firestore', res);
      },
      error: (err) => {
        console.error('❌ Error al actualizar escala', err);
      }
    });
  }

  generarEscala() {
    const inicio = Number(this.pregunta.valorMin) || 1;
    const fin = Number(this.pregunta.valorMax) || 5;

    this.escala = Array.from({ length: fin - inicio + 1 }, (_, i) => i + inicio);
  }

  actualizarEtiquetas() {
    if (!this.editandoEncuesta) return;
    const url = `https://firestore.googleapis.com/v1/projects/appencuestabd/databases/(default)/documents/preguntas/${this.pregunta.id}?updateMask.fieldPaths=etiquetaInicio&updateMask.fieldPaths=etiquetaFin`;

    const body = {
      fields: {
        etiquetaInicio: { stringValue: this.pregunta.etiquetaInicio || 'Peor' },
        etiquetaFin: { stringValue: this.pregunta.etiquetaFin || 'Mejor' }
      }
    };

    this.http.patch(url, body).subscribe({
      next: (res) => {
        console.log('✅ Etiquetas actualizadas en Firestore', res);
      },
      error: (err) => {
        console.error('❌ Error al actualizar etiquetas', err);
      }
    });
  }

  actualizarCampo(campos: Record<string, any>) {
    if (!this.editandoEncuesta) return;
    if (!this.pregunta?.id || !this.pregunta?.idEncuesta) return;

    const url = `https://firestore.googleapis.com/v1/projects/appencuestabd/databases/(default)/documents/encuestas/${this.pregunta.idEncuesta}/preguntas/${this.pregunta.id}`;
    const body: any = { fields: {} };

    for (const [clave, valor] of Object.entries(campos)) {
      if (valor === undefined) continue; // ✅ Evita undefined
      if (valor === null) body.fields[clave] = { nullValue: null };
      else if (typeof valor === 'boolean') body.fields[clave] = { booleanValue: valor };
      else if (typeof valor === 'number') body.fields[clave] = { integerValue: valor.toString() };
      else body.fields[clave] = { stringValue: valor.toString() };
    }

    const mask = Object.keys(campos).map(c => `updateMask.fieldPaths=${c}`).join('&');
    this.http.patch(`${url}?${mask}`, body).subscribe({
      next: () => console.log('✅ Campo(s) actualizado(s)', campos),
      error: err => console.error('❌ Error al actualizar campo(s)', err)
    });
  }
}
