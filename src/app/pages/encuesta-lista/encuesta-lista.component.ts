import { Component, OnInit } from '@angular/core';
import { Encuesta } from 'src/app/models/encuesta.model';
import { EncuestaService } from 'src/app/services/collections/encuesta.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta-lista',
  templateUrl: './encuesta-lista.component.html',
  styleUrls: ['./encuesta-lista.component.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule
  ]
})

export class EncuestaListaComponent  implements OnInit {
  encuestas : Encuesta[] =[];
  loading = true;

  constructor(private encuestaService : EncuestaService) { }

  ngOnInit() {
    this.cargarEncuesta();
  }

  cargarEncuesta(){
    this.loading = true;
    this.encuestaService.getAll().subscribe({
      next : data => {
        this.encuestas = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando encuestas', err);
        this.loading = false;
      }
    });
  }
}
