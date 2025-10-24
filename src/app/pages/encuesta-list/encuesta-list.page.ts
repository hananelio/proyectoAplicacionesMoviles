import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'
import { Encuesta } from 'src/app/models/encuesta.model';
import { EncuestaService } from 'src/app/services/collections/encuesta.service';
import { RouterLink } from '@angular/router';
import { EncuestaStateService } from 'src/app/services/core/encuesta-state.service';
import { HeaderComponent } from '../header/header.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-encuesta-list',
  templateUrl: './encuesta-list.page.html',
  styleUrls: ['./encuesta-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule,
    RouterLink, HeaderComponent
]
})
export class EncuestaListPage implements OnInit, OnDestroy {

  encuestas : Encuesta[] = [];
  cargando = true;

  private sub!: Subscription;

  constructor(
    private encuestaService: EncuestaService,
    private alertCtrl: AlertController,
    private encuestaState: EncuestaStateService,
    private location: Location
  ) { }

  ngOnInit() {
    this.sub = this.encuestaState.encuestas$.subscribe(
      data => {
        this.encuestas = data;
        this.cargando = false;
    });

    this.encuestaState.refrescar(); // carga inicial
    //this.cargarEncuestas();
    //this.encuestaState.refrescar$.subscribe(() => this.cargarEncuestas());
  }

  ngOnDestroy() {
    // 🔒 Evita fugas de memoria al salir de la página
    if (this.sub) this.sub.unsubscribe();
  }

  /*cargarEncuestas() {
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
  }*/

  async eliminarEncuesta(encuesta: Encuesta){
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Eliminar la encuesta ${encuesta.titulo.toUpperCase()}?`,
      buttons : [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar',
          handler: async() => {
            //this.cargando = true;
            // 🔹 1. Actualiza visualmente al instante
            this.encuestaState.eliminarLocal(encuesta.id);
            
            this.encuestaService.delete(encuesta.id).subscribe({
              next : () => this.encuestaState.refrescar(),//this.cargarEncuestas()
              error : (err) => {
                console.error('Error al eliminar', err);
                this.encuestaState.refrescar();
                //this.cargando = false;
              }
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
