import { Component, EventEmitter, Input, Output, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { Pregunta } from 'src/app/models/pregunta.model';
import { PreguntaService } from 'src/app/services/collections/pregunta.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { add, addCircle, addCircleOutline, options, trash, trashOutline } from 'ionicons/icons';

export interface Opcion {
  valor: string;
  esOtro?: boolean;
  valorUsuario?: string;
}

@Component({
  selector: 'app-pregunta-item',
  templateUrl: './pregunta-item.component.html',
  styleUrls: ['./pregunta-item.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule]
})
export class PreguntaItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pregunta!: Pregunta;
  @Input() indice!: number;

  @Input() editandoEncuesta: boolean = true;
  @Input() editandoNombre: boolean = false;
  @Input() editandoTipo: boolean = false;

  @Output() agregarDebajo = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<Pregunta>();
  @Output() activarEdicion = new EventEmitter<string>();
  @Output() salirEdicion = new EventEmitter<void>();
  @Output() respuestaSeleccionada = new EventEmitter<{ idPregunta: string; valor: any }>();
  valoresMinimos = [0, 1];
  valoresMaximos = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  escala: number[] = [];
  tiposPregunta = ['texto', 'seleccion_unica', 'seleccion_multiple', 'escala', 'desplegable', 'calificacion'];
  //obligatorio = false;
  private etiquetaTimeout: any;

  constructor(
    private preguntaService: PreguntaService,
    private http: HttpClient,
    private el: ElementRef
  ) {
    addIcons({trash, trashOutline, add, options, addCircle, addCircleOutline})
  }

  ngOnInit() {
    this.initPregunta();
    this.generarEscala();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pregunta'] && this.pregunta) {
      this.pregunta.valorMin = Number(this.pregunta.valorMin) || 1;
      this.pregunta.valorMax = Number(this.pregunta.valorMax) || 5;
      this.generarEscala();
    }
  }

  ngOnDestroy() {
    clearTimeout(this.etiquetaTimeout);
  }

  private initPregunta() {
    this.pregunta = this.pregunta || {} as Pregunta;
    this.pregunta.opciones = this.pregunta.opciones || [];
    this.pregunta.respuestasMarcadas = this.pregunta.respuestasMarcadas || {};
    this.pregunta.seleccion = this.pregunta.seleccion ?? undefined;
  }

  @HostListener('document:click', ['$event'])
  onClickDocument(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) {
      if (this.editandoTipo) this.editandoTipo = false;
      if (this.editandoNombre) {
        // llama explícitamente a guardarNombre
        this.guardarNombre();
      }
      this.salirEdicion.emit();
    }
  }

  /** ====== ESCALA ====== */
  generarEscala() {
    if (this.pregunta.valorMin !== undefined && this.pregunta.valorMax !== undefined) {
      this.escala = Array.from({ length: this.pregunta.valorMax - this.pregunta.valorMin + 1 }, (_, i) => i + this.pregunta.valorMin!);
    } else {
      this.escala = [];
    }
  }

  actualizarEscala() {
    this.generarEscala();
    this.actualizarCampo({ valorMin: this.pregunta.valorMin, valorMax: this.pregunta.valorMax });
  }

    /** ====== OBLIGATORIEDAD ====== */
  toggleObligatorio() {
    this.pregunta.obligatorio = !this.pregunta.obligatorio;
    this.actualizarCampo({ obligatorio: this.pregunta.obligatorio });
  }

  /** ====== EDICIÓN ====== */
  toggleNombre(event?: Event) {
    event?.stopPropagation();
    this.editandoNombre = true;
    this.editandoTipo = false;
    this.activarEdicion.emit(this.pregunta.id);
  }

  toggleTipo(event?: Event) {
    event?.stopPropagation();
    this.editandoTipo = true;
    this.editandoNombre = false;
  }

  guardarNombre() {
    if (event) event.stopPropagation();
    if (!this.pregunta.nombre) return;
    this.editandoNombre = false;
    this.actualizarCampo({ nombre: this.pregunta.nombre });
  }

  guardarTipo() {
    this.editandoTipo = false;
    const nuevoTipo = this.pregunta.tipo;

    // Limpiamos campos según tipo
    if (nuevoTipo === 'seleccion_unica' || nuevoTipo === 'seleccion_multiple') {
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
      this.pregunta.opciones = [];
    }

    this.actualizarCampo({
      tipo: nuevoTipo,
      opciones: this.pregunta.opciones,
      valorMin: this.pregunta.valorMin,
      valorMax: this.pregunta.valorMax,
      etiquetaInicio: this.pregunta.etiquetaInicio,
      etiquetaFin: this.pregunta.etiquetaFin
    });
  }

  eliminarPregunta() { this.eliminar.emit(this.pregunta); }

  /** ====== OPCIONES ====== */
  agregarOpcion(esOtro: boolean = false) {
    const opciones = this.pregunta.opciones || [];
    if (esOtro && opciones.some(o => o.esOtro)) return;
    const nueva: Opcion = { valor: esOtro ? 'Otro' : `Opción ${opciones.length + 1}`, esOtro };
    const idxOtro = opciones.findIndex(o => o.esOtro);
    if (!esOtro && idxOtro !== -1) opciones.splice(idxOtro, 0, nueva);
    else opciones.push(nueva);

    this.pregunta.opciones = opciones;
    this.actualizarCampo({ opciones: this.pregunta.opciones });
  }

  eliminarOpcion(index: number) {
    if (!this.pregunta.opciones) return;
    this.pregunta.opciones.splice(index, 1);
    this.actualizarCampo({ opciones: this.pregunta.opciones });
  }

  setValorOpcion(opcion: Opcion, valor: string) {
    opcion.valor = valor;
    this.actualizarCampo({ opciones: this.pregunta.opciones });
  }

  focusSiguienteOpcion(index: number, event: Event) {
    event.preventDefault();
    const siguiente = index + 1;
    const inputs = Array.from(this.el.nativeElement.querySelectorAll('ion-input input')) as HTMLInputElement[];
    if (siguiente < inputs.length) {
      inputs[siguiente]?.focus();
    } else {
      this.agregarOpcion();
    }
  }

  /** ====== RESPUESTAS ====== */
  onSeleccionarRespuesta(opcion: Opcion) {
    if (!this.editandoEncuesta) return;
    this.pregunta.seleccion = opcion.valor;

    if (!opcion.esOtro) {
      this.respuestaSeleccionada.emit({ idPregunta: this.pregunta.id!, valor: opcion.valor });
      this.pregunta.opciones?.forEach(o => { if (o.esOtro) o.valorUsuario = ''; });
    }

    this.actualizarCampo({ seleccion: this.pregunta.seleccion, opciones: this.pregunta.opciones });
  }

  onToggleCheckbox(valor: string, checked: boolean) {
    this.pregunta.respuestasMarcadas = this.pregunta.respuestasMarcadas || {};
    this.pregunta.respuestasMarcadas[valor] = checked;
    this.pregunta.opciones?.forEach(o => {
      if (o.valor === valor && o.esOtro && !checked) o.valorUsuario = '';
    });
    this.actualizarCampo({ respuestasMarcadas: this.pregunta.respuestasMarcadas, opciones: this.pregunta.opciones });
  }

  onCambioValorOtro(opcion: Opcion) {
    this.respuestaSeleccionada.emit({ idPregunta: this.pregunta.id!, valor: opcion.valorUsuario || opcion.valor });
    this.actualizarCampo({ opciones: this.pregunta.opciones, seleccion: this.pregunta.seleccion });
  }

  tieneOtro(): boolean { return this.pregunta.opciones?.some(o => o.esOtro) || false; }

  /** ====== HTTP ====== */
  actualizarCampo(campos: Record<string, any>) {
    if (!this.pregunta?.id || !this.pregunta?.idEncuesta) return;

    this.preguntaService.update(this.pregunta.idEncuesta, this.pregunta.id, campos)
      .subscribe({
        next: () => console.log('✅ Campo(s) actualizado(s)', campos),
        error: err => console.error('❌ Error actualizando campos', err)
      });
  }

  onEtiquetaChange() {
    clearTimeout(this.etiquetaTimeout);
    this.etiquetaTimeout = setTimeout(() => {
      this.actualizarCampo({ etiquetaInicio: this.pregunta.etiquetaInicio, etiquetaFin: this.pregunta.etiquetaFin });
    }, 500);
  }
}
