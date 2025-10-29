import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Pregunta } from 'src/app/models/pregunta.model';
import { PreguntaService } from 'src/app/services/collections/pregunta.service';
import { PreguntaItemComponent } from "../pregunta-item/pregunta-item.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IonicModule } from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-pregunta-list',
  templateUrl: './pregunta-list.component.html',
  styleUrls: ['./pregunta-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule, DragDropModule, CdkDropList, CdkDrag,
    PreguntaItemComponent, CommonModule
  ],
})
export class PreguntaListComponent  {
  @Input() preguntas: Pregunta[] = [];
  @Output() preguntasChange = new EventEmitter<Pregunta[]>();
  @Input() editandoEncuesta: boolean = false;
  @Input() preguntaEditandoId: string | null = null;  // <-- aquí
  @Output() activarEdicion = new EventEmitter<string>();
  @Output() desactivarEdicion = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('app-pregunta-item');
    if (!clickedInside) {
      this.preguntaEditandoId = null;
    }
  }

  constructor(private preguntaService: PreguntaService) { }

  drop(event: CdkDragDrop<Pregunta[]>) {
    moveItemInArray(this.preguntas, event.previousIndex , event.currentIndex);

    this.preguntasChange.emit(this.preguntas);
  }

  agregarPreguntaDebajo(index: number) {
    const idEncuesta = this.preguntas[0]?.idEncuesta || '';
    const nueva: Pregunta = {
      idEncuesta,
      texto: 'Nueva pregunta',
      tipo: 'texto',
      opciones: [],
      obligatorio: false,
      orden: index + 1
    };

    //Insertar visualmente
    this.preguntas.splice(index + 1, 0, nueva);
    this.preguntasChange.emit(this.preguntas);

    //Guardar en BD
    this.preguntaService.create(nueva).subscribe((resp) => {
      if(resp?.id) nueva.id = resp.id;
    })
  }

  eliminarPregunta(pregunta: Pregunta) {
    this.preguntas = this.preguntas.filter(p => p !== pregunta);
    this.preguntasChange.emit(this.preguntas);

    if(pregunta.id && pregunta.idEncuesta) {
      this.preguntaService.delete(pregunta.idEncuesta, pregunta.id).subscribe();
    }
  }

  /*activarEdicion(id: string) {
    this.preguntaEditandoId = id;
  }

  desactivarEdicion() {
    this.preguntaEditandoId = null;
  }*/
}
