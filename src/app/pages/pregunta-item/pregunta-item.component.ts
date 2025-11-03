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
export class PreguntaItemComponent implements OnChanges, OnDestroy, OnInit {
  @Input() pregunta!: Pregunta;
  @Input() indice!: number; // 👈 Aquí declaras el input que falta

  @Input() editandoEncuesta: boolean = true;
  @Input() editandoTexto: boolean = false;
  @Input() editandoTipo: boolean = false;

  @Output() agregarDebajo = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<Pregunta>();
  @Output() activarEdicion = new EventEmitter<string>();
  @Output() salirEdicion = new EventEmitter<void>();
  @Output() respuestaSeleccionada = new EventEmitter<{ idPregunta: string, valor: any }>();

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
    // Si la pregunta no existe (undefined), crea un objeto vacío del tipo Pregunta
    this.pregunta = this.pregunta || {} as Pregunta;
    // Si no hay opciones, inicializa un array vacío para evitar errores con .push() o .splice()
    this.pregunta.opciones = this.pregunta.opciones || [];
    // Inicializa las respuestas marcadas (para checkbox)
    this.pregunta.respuestasMarcadas = this.pregunta.respuestasMarcadas || {};
    // Si la selección es null o undefined, la deja en undefined
    this.pregunta.seleccion = this.pregunta.seleccion ?? undefined;
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

  @HostListener('document:click', ['$event'])
  onClickDocument(event: Event) {
    if (!this.el.nativeElement.contains(event.target) && (this.editandoTexto || this.editandoTipo)) {
      this.editandoTexto = false;
      this.editandoTipo = false;
      this.salirEdicion.emit();
    }
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
    const nuevoTipo = this.pregunta.tipo;

    if (nuevoTipo === 'opcion_multiple' || nuevoTipo === 'checkbox') {
      this.pregunta.valorMin = undefined;
      this.pregunta.valorMax = undefined;
      this.pregunta.etiquetaInicio = '';
      this.pregunta.etiquetaFin = '';

      if (!this.pregunta.opciones || this.pregunta.opciones.length === 0) {
        this.pregunta.opciones = [{ valor: 'Opción 1' }];
      }
    } else if (nuevoTipo === 'escala') {
      this.pregunta.opciones = [];

      this.pregunta.valorMin = 1;
      this.pregunta.valorMax = 5;
      this.pregunta.etiquetaInicio = 'Bajo';
      this.pregunta.etiquetaFin = 'Alto';
      this.generarEscala();
    } else {
      // Si es texto u otro tipo, limpia todo lo que no aplique
      this.pregunta.opciones = [];
      this.pregunta.valorMin = undefined;
      this.pregunta.valorMax = undefined;
      this.pregunta.etiquetaInicio = '';
      this.pregunta.etiquetaFin = '';
    }

    this.actualizarCampo({
      tipo: nuevoTipo, //this.pregunta.tipo
      opciones: this.pregunta.opciones,
      valorMin: this.pregunta.valorMin,
      valorMax: this.pregunta.valorMax,
      etiquetaInicio: this.pregunta.etiquetaInicio,
      etiquetaFin: this.pregunta.etiquetaFin
    });
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

    this.preguntaService
      .update(this.pregunta.idEncuesta, this.pregunta.id, campos)
      .subscribe({
        next: () => console.log('✅ Campo(s) actualizado(s)', campos),
        error: (err) => console.error('❌ Error actualizando campos', err),
      });
  }

  onToggleCheckbox(valor: string, checked: boolean) {
    if (!this.pregunta.respuestasMarcadas) {
      this.pregunta.respuestasMarcadas = {};
    }
    this.pregunta.respuestasMarcadas[valor] = checked;
  }

  agregarOpcion(esOtro: boolean = false) {
    this.pregunta.opciones = this.pregunta.opciones || [];
    
    // Evita agregar "Otro" si ya existe
    if (esOtro && this.tieneOtro()) return;

    const num = this.pregunta.opciones.length + 1;
    const nueva: { valor: string; esOtro?: boolean } = { valor: esOtro ? 'Otro' : `Opción ${num}`, esOtro };
    
    this.pregunta.opciones.push(nueva);
    
    setTimeout(() => {
      const activo = document.activeElement as HTMLElement;
      const entradas = Array.from(document.querySelectorAll('ion-input input')) as HTMLInputElement[];
      const ultimo = entradas[entradas.length - 1];
      // ✅ Evita duplicar foco
      if (activo !== ultimo) {
        ultimo?.focus();
      }
    }, 50);

    this.guardarOpciones();
  }

  focusUltimaOpcion() {
    const inputs = Array.from(document.querySelectorAll('ion-input input')) as HTMLInputElement[];
    inputs[inputs.length - 1].focus();
  }

  guardarOpciones() {
    if (!this.pregunta.opciones) return;

    // Filtrar opciones vacías
    this.pregunta.opciones = this.pregunta.opciones
        .filter(opcion => (opcion.esOtro ? opcion.valorUsuario?.trim(): opcion.valor?.trim()) !== "");

    // Enviar directamente el arreglo limpio
    this.actualizarCampo({ opciones: this.pregunta.opciones });
  }

  eliminarOpcion(index: number) {
    this.pregunta.opciones = this.pregunta.opciones || [];

    this.pregunta.opciones.splice(index, 1);
    this.guardarOpciones();
  }

  focusSiguienteOpcion(index: number, event: Event) {
    const keyboardEvent = event as KeyboardEvent; // forzar a KeyboardEvent
    keyboardEvent.preventDefault();

    this.pregunta.opciones = this.pregunta.opciones || [];

    const siguiente = index + 1;
    const inputs = Array.from(document.querySelectorAll('ion-input input')) as HTMLInputElement[];
    
    if (siguiente < this.pregunta.opciones.length) {
      const siguienteInput = inputs[siguiente];
      if (siguienteInput && document.activeElement !== siguienteInput) {
        siguienteInput.focus();
      }
    } else {
      this.agregarOpcion();
      setTimeout(() => {
        const actualizados = Array.from(this.el.nativeElement.querySelectorAll('ion-input input')) as HTMLInputElement[];
        const nuevo = actualizados[siguiente];
        if (nuevo && document.activeElement !== nuevo) {
          nuevo.focus();
        }
      }, 50);
    }
  }

  getValorOpcion(opcion: any): string {
    return opcion.esOtro ? (opcion.valorUsuario || '') : opcion.valor;
  }

  setValorOpcion(opcion: any, valor: string) {
    if (opcion.esOtro) {
      opcion.valorUsuario = valor;
    } else {
      opcion.valor = valor;
    }
    this.guardarOpciones();
  }

  tieneOtro(): boolean {
    return this.pregunta.opciones?.some(opcion => opcion.esOtro) || false;
  }
}
