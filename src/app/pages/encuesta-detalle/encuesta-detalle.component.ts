
import { Component, Input, OnInit } from '@angular/core';
import { Encuesta } from 'src/app/models/encuesta.model';
import { EncuestaService } from 'src/app/services/collections/encuesta.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-encuesta-detalle',
  templateUrl: './encuesta-detalle.component.html',
  styleUrls: ['./encuesta-detalle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class EncuestaDetalleComponent  implements OnInit {
  @Input() encuestaId? : string;

  encuesta : Encuesta ={
    id: '',
    titulo: '',
    creadorId: '',
    fechaCreacion: new Date().toISOString(),
    estado: 'borrador'
  };

  loading = false;

  constructor(private encuestaService: EncuestaService) { }

  ngOnInit() {
    if(this.encuestaId){
      this.loadEncuesta(this.encuestaId)
    }
  }

  loadEncuesta(id: string){
    this.loading =true;
    this.encuestaService.getById(id).subscribe({
      next: data => {
        this.encuesta = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  
  save(){
    this.loading = true;
    const obs = this.encuesta.id 
      ? this.encuestaService.update(this.encuesta.id, this.encuesta)
      : this.encuestaService.create(this.encuesta);
    
    obs.subscribe({
      next: data => {
        this.encuesta = data;
        this.loading = false;
        alert('Encuesta guardada con éxito');
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  delete() {
    if(!this.encuesta.id) return;
    if(!confirm('¿Seguro que quieres eliminar esta encuesta?')) return;

    this.loading = true;
    this.encuestaService.delete(this.encuesta.id).subscribe({
      next: () => {
        alert('Encuesta eliminada');
        this.encuesta = {
          id: '',
          titulo: '',
          creadorId: '',
          fechaCreacion: new Date().toISOString(),
          estado: 'borrador'
        };
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    })
  }
}
