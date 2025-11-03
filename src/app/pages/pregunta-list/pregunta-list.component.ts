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
    IonicModule, DragDropModule,
    PreguntaItemComponent, CommonModule
  ],
})
export class PreguntaListComponent  {
  @Input() preguntas: Pregunta[] = [];
  @Output() agregar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<Pregunta>();

  onAgregar() {
    this.agregar.emit();
  }

  onEliminar(p: Pregunta) {
    this.eliminar.emit(p);
  }
}
