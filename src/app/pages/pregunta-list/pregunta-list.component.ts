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
  @Input() idEncuesta!: string;
  @Output() agregar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<Pregunta>();

  constructor(private preguntaService: PreguntaService) {}
  
   /**Drag & Drop: cuando cambian de posición */
  drop(event: CdkDragDrop<Pregunta[]>) {
    moveItemInArray(this.preguntas, event.previousIndex, event.currentIndex);
    this.actualizarOrdenes();
  }

  /**Agregar pregunta al final */
  onAgregarPregunta() {
    
    const ultimoOrden = this.preguntas.length > 0
      ? Math.max(...this.preguntas.map(p => p.orden || 0))
      : 0;

    const nueva: Pregunta = {
      nombre: 'Nueva Pregunta',
      tipo: 'texto',
      obligatorio: false,
      opciones: [],
      idEncuesta: this.idEncuesta,
      orden: ultimoOrden + 1
    };

    this.preguntaService.create(nueva)
      .subscribe((preguntaCreada: Pregunta) => {
        this.preguntas.push(preguntaCreada); // ahora tiene ID de Firestore
      });
  }

  /**Agregar pregunta debajo de otra pregunta */
  onAgregarPreguntaDebajo(indice: number) {
    //const ordenActual = Number(this.preguntas[indice].orden) || (indice + 1);
    //const nuevoOrden = ordenActual + 1;
    
    const nueva: Pregunta = {
      nombre: 'Nueva Pregunta',
      tipo: 'texto',
      obligatorio: false,
      opciones: [],
      idEncuesta: this.idEncuesta,
      orden: indice + 2
    };
    
    // Aumentar orden de las preguntas que estaban debajo
    this.preguntas
      .filter(p => (p.orden || 0) >= nueva.orden)
      .forEach(p => p.orden!++);

    this.preguntaService.create(nueva)
      .subscribe((preguntaCreada: Pregunta) => {
        this.preguntas.splice(indice + 1, 0, preguntaCreada);
        for (let i = 0; i < this.preguntas.length; i++) {
          const p = this.preguntas[i];
          const nuevoOrdenSiguiente = i + 1;

          if (p.orden !== nuevoOrdenSiguiente) {
            p.orden = nuevoOrdenSiguiente;
            this.preguntaService
              .update(p.idEncuesta!, p.id!, { orden: nuevoOrdenSiguiente })
              .subscribe();
          }
        }
      });
  }

  /**Eliminar una pregunta */
  onEliminarPregunta(pregunta: Pregunta) {
    if (!pregunta.id || !pregunta.idEncuesta) return;

    this.preguntaService.delete(pregunta.idEncuesta, pregunta.id)
      .subscribe(() => {
        this.preguntas = this.preguntas.filter(p => p.id !== pregunta.id);
        
        this.preguntas.forEach((p, index) =>{
          const nuevoOrden = index + 1;
          if (p.orden !== nuevoOrden) {
            p.orden = nuevoOrden;
            this.preguntaService.update(p.idEncuesta!, p.id!, { orden: nuevoOrden })
              .subscribe(() => console.log(`Orden actualizado: ${p.nombre} → ${nuevoOrden}`));
          }
        });
      });
  }

  actualizarOrdenes() {
    this.preguntas.forEach((p, index) => {
      const nuevoOrden = index + 1;
      if(p.orden !== nuevoOrden) {
        this.preguntaService.update(this.idEncuesta, p.id!, { orden: nuevoOrden })
          .subscribe();
      }
    })
  }


}
