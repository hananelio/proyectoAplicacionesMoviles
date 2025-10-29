import { Component, EventEmitter, Input, Output, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges, HostListener } from '@angular/core';
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
export class PreguntaItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pregunta!: Pregunta;

  @Input() editandoEncuesta: boolean = true;
  @Input() editandoTexto: boolean = false;
  @Input() editandoTipo: boolean = false;

  @Output() agregarDebajo = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<Pregunta>();
  @Output() activarEdicion = new EventEmitter<string>();
  @Output() salirEdicion = new EventEmitter<void>();

  @Output() respuestaSeleccionada = new EventEmitter<{ idPregunta: string, valor: any }>();
  selecciones = new Set<string>(); // Para almacenar temporalmente las opciones seleccionadas en checkbox
  @HostListener('document:click', ['$event'])

  escala: number[] = [];
  private clickListener!: any;
  private etiquetaTimeout: any;

  tiposPregunta = ['texto', 'opcion_multiple', 'checkbox', 'escala'];

  constructor(
    private preguntaService: PreguntaService,
    private http: HttpClient,
    private el: ElementRef
  ) {}

  ngOnInit() {
    // Asegura que siempre exista la pregunta y la propiedad respuestasMarcadas
    if (!this.pregunta) {
      this.pregunta = {} as Pregunta;
    }

    if (!this.pregunta.opciones) {
      this.pregunta.opciones = [];
    }

    if (!this.pregunta.respuestasMarcadas) {
      this.pregunta.respuestasMarcadas = {};
    }

    this.pregunta.respuestasMarcadas = this.pregunta.respuestasMarcadas || {};
    
    // 🧩 Asegurar estructura de pregunta para evitar undefined
    if (!this.pregunta.opciones) {
      this.pregunta.opciones = [];
    }

    if (!(this.pregunta as any).respuestasMarcadas) {
      (this.pregunta as any).respuestasMarcadas = {};
    }
    // Detectar clic fuera del componente
    this.clickListener = (event: Event) => {
      if (!this.el.nativeElement.contains(event.target) && (this.editandoTexto || this.editandoTipo)) {
        this.editandoTexto = false;
        this.editandoTipo = false;
        this.salirEdicion.emit();
      }
    }
    document.addEventListener('click', this.clickListener);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['pregunta'] && this.pregunta) {
      // normaliza por si viene como string u undefined
      this.pregunta.valorMin = Number(this.pregunta.valorMin) || 1;
      this.pregunta.valorMax = Number(this.pregunta.valorMax) || 5;
      // genera la escala para visualizar
      this.generarEscala();

      // debug temporal
      console.log('[PreguntaItem] carga pregunta:', {
        id: this.pregunta.id,
        valorMin: this.pregunta.valorMin,
        valorMax: this.pregunta.valorMax,
        etiquetaInicio: this.pregunta.etiquetaInicio,
        etiquetaFin: this.pregunta.etiquetaFin,
        escala: this.escala
      });
    }
  }

  ngOnDestroy() {
    // Limpiar listener al destruir el componente
    document.removeEventListener('click', this.clickListener);
  }

  /* ======== ESCALA ======== */
  // Rangos para edición
  get rangoMin(): number[] {
    //return Array.from({ length: 11 }, (_, i) => i); // 0 a 10
    return Array.from({ length: 2 }, (_, i) => i); // 0 a 10
  }

  get rangoMax(): number[] {
    //return Array.from({ length: 11 }, (_, i) => i); // 0 a 10
    return Array.from({ length: 9 }, (_, i) => i + 2); // 0 a 10
  }

  // Genera escala para visualización
  /*generarEscala() {
    const inicio = Number(this.pregunta.valorMin) || 1;
    const fin = Number(this.pregunta.valorMax) || 5;

    this.escala = Array.from({ length: fin - inicio + 1 }, (_, i) => i + inicio);
  }*/
  generarEscala() {
    if (this.pregunta.valorMin !== undefined && this.pregunta.valorMax !== undefined) {
      this.escala = Array.from(
        { length: this.pregunta.valorMax - this.pregunta.valorMin + 1 },
        (_, i) => i + this.pregunta.valorMin!
      );
    } else {
      this.escala = [];
    }
  }

  actualizarEscala() {
    this.generarEscala();
    this.actualizarCampo({ valorMin: this.pregunta.valorMin, valorMax: this.pregunta.valorMax });
  }

  /* ======== EDICIÓN ======== */
  /** Toggle edición de texto */
  toggleTexto(event?: Event) {
    if (event) event.stopPropagation(); // evita que el listener cierre
    this.editandoTexto = true;
    this.editandoTipo = false;
    this.activarEdicion.emit(this.pregunta.id);
  }

  /** Toggle edición de tipo */
  toggleTipo(event?: Event) {
    //if (!this.editandoEncuesta) return;
    if (event) event.stopPropagation();
    this.editandoTipo = true;
    this.editandoTexto = false;
  }

  /** Guardar texto editado */
  guardarTexto() {
    this.editandoTexto = false;
    this.actualizarCampo({ texto: this.pregunta.texto });
  }

  /** Guardar tipo editado */
  guardarTipo() {
    this.editandoTipo = false;
    this.actualizarCampo({ tipo: this.pregunta.tipo });

    if ((this.pregunta.tipo === 'opcion_multiple' || this.pregunta.tipo === 'checkbox') && (!this.pregunta.opciones || this.pregunta.opciones.length === 0)) {
      this.pregunta.opciones = [{ valor: 'Opción 1' }]; // agrega una opción vacía
    }
  }

  eliminarPregunta() {
    this.eliminar.emit(this.pregunta);
  }

  onSeleccionarRespuesta(opcion: string) {
    if (!this.editandoEncuesta) return;

    this.pregunta.seleccion = opcion;

    this.respuestaSeleccionada.emit({
      idPregunta: this.pregunta.id!,
      valor: this.pregunta.seleccion
    });

    this.actualizarCampo({ seleccion: this.pregunta.seleccion });
  }

  onEtiquetaChange() {
    clearTimeout(this.etiquetaTimeout);
    this.etiquetaTimeout = setTimeout(() => this.actualizarCampo({
      etiquetaInicio: this.pregunta.etiquetaInicio,
      etiquetaFin: this.pregunta.etiquetaFin
    }), 500);
  }

  /* ======== HTTP GENÉRICO ======== */
  actualizarCampo(campos: Record<string, any>) {
    if (!this.pregunta?.id || !this.pregunta?.idEncuesta) return;

    const url = `https://firestore.googleapis.com/v1/projects/appencuestabd/databases/(default)/documents/encuestas/${this.pregunta.idEncuesta}/preguntas/${this.pregunta.id}`;
    const body: any = { fields: {} };
    const mask: string[] = [];

    Object.entries(campos).forEach(([clave, valor]) => {
      mask.push(`updateMask.fieldPaths=${clave}`);
      if (valor === null) body.fields[clave] = { nullValue: null };
      else if (typeof valor === 'boolean') body.fields[clave] = { booleanValue: valor };
      else if (typeof valor === 'number') body.fields[clave] = { integerValue: valor.toString() };
      else body.fields[clave] = { stringValue: valor?.toString() || '' };
    });

    this.http.patch(`${url}?${mask.join('&')}`, body).subscribe({
      next: () => console.log('✅ Campo(s) actualizado(s)', campos),
      error: err => console.error('❌ Error actualizando campos', err)
    });
  }

  onToggleCheckbox(valor: string, checked: boolean) {
    if (!this.pregunta.respuestasMarcadas) {
      this.pregunta.respuestasMarcadas = {};
    }
    this.pregunta.respuestasMarcadas[valor] = checked;
  }

  agregarOpcion(esOtro: boolean = false) {
    const num = this.pregunta.opciones.length + 1;
    const nueva = { valor: esOtro ? 'Otro' : `Opción ${num}`, esOtro };
    this.pregunta.opciones.push(nueva);
    
    setTimeout(() => {
      const inputs = Array.from(document.querySelectorAll('ion-input input')) as HTMLInputElement[];
      inputs[inputs.length - 1].focus();
    }, 50);
  }

  focusUltimaOpcion() {
    const inputs = Array.from(document.querySelectorAll('ion-input input')) as HTMLInputElement[];
    inputs[inputs.length - 1].focus();
  }

  guardarOpciones() {
    // Guardar solo los valores de texto
    if (!this.pregunta.opciones) return;
    this.pregunta.opciones = this.pregunta.opciones.filter(op => op.valor.trim() !== '');
    this.actualizarCampo({ opciones: this.pregunta.opciones.map(op => op.valor) });
  }

  eliminarOpcion(index: number) {
    this.pregunta.opciones.splice(index, 1);
    this.guardarOpciones();
  }

  focusSiguienteOpcion(index: number, event: Event) {
    const keyboardEvent = event as KeyboardEvent; // forzar a KeyboardEvent
    keyboardEvent.preventDefault();

    const siguiente = index + 1;
    if (siguiente < this.pregunta.opciones.length) {
      const inputs = Array.from(document.querySelectorAll('ion-input input')) as HTMLInputElement[];
      inputs[siguiente]?.focus();
    } else {
      this.agregarOpcion();
      setTimeout(() => {
        const inputs = Array.from(this.el.nativeElement.querySelectorAll('ion-input input')) as HTMLInputElement[];
        inputs[siguiente]?.focus();
      }, 50);
    }
  }
}
