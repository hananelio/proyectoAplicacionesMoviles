import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule, AlertController } from '@ionic/angular'
import { Encuesta } from 'src/app/models/encuesta.model';
import { EncuestaService } from 'src/app/services/collections/encuesta.service';
import { RouterLink } from '@angular/router';
import { EncuestaStateService } from 'src/app/services/core/encuesta-state.service';
import { HeaderComponent } from '../header/header.component';
import { Location } from '@angular/common';
import { FabButtonComponent } from '../fab-button/fab-button.component';

@Component({
  selector: 'app-encuesta-list',
  templateUrl: './encuesta-list.page.html',
  styleUrls: ['./encuesta-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule,
    RouterLink, HeaderComponent, FabButtonComponent
]
})
export class EncuestaListPage implements OnInit {

  encuestas : Encuesta[] = [];
  cargando = true;

  constructor(
    private encuestaService: EncuestaService,
    private alertCtrl: AlertController,
    private encuestaState: EncuestaStateService,
    private location: Location
  ) { }


  ngOnInit() {
    this.cargarEncuestas();
    this.encuestaState.refrescar$.subscribe(() => this.cargarEncuestas());
  }

  cargarEncuestas() {
    this.encuestaService.getAll().subscribe({
      next: (data) => {
        this.encuestas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar encuestas', err);
        this.cargando = false;
      }
    });
  }

  async eliminarEncuesta(encuesta: Encuesta){
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Eliminar la encuesta ${encuesta.titulo.toUpperCase()}?`,
      buttons : [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar',
          handler: async() => {
            this.encuestaService.delete(encuesta.id).subscribe({
              next : () => this.cargarEncuestas(),
              error : (err) => console.error('Error al eliminar', err)
            });
          }
        }
      ]
    });
    await alert.present();
  }

  volver() {
    this.location.back();
  }
}
