import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Encuesta } from 'src/app/models/encuesta.model';
import { EncuestaService } from 'src/app/services/collections/encuesta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular'
import { EncuestaStateService } from 'src/app/services/core/encuesta-state.service';

@Component({
  selector: 'app-encuesta-form',
  templateUrl: './encuesta-form.page.html',
  styleUrls: ['./encuesta-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule
  ]
})
export class EncuestaFormPage implements OnInit {
  encuesta: Encuesta = { //Inicializa la encuesta vacía por defecto
    id: '',
    titulo: '',
    descripcion: '',
    creadorId: '',
    fechaCreacion: new Date().toISOString(),
    estado: 'borrador'
  };

  editMode = false; //indica si el formulario está en modo edición o creación.
  id!: string; //almacena el parámetro id obtenido desde la URL (/encuesta/editar/:i

  constructor( // Inyecta servicios que el componente necesita
    private encuestaService: EncuestaService, //acceder, crear o editar encuestas.
    private route: ActivatedRoute, //leer el parámetro id de la ruta.
    private router: Router, //navegar entre vistas.
    private alertCtrl: AlertController, //mostrar mensajes al usuario.
    private encuestaState: EncuestaStateService

  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.editMode = true;
      this.encuestaService.getById(this.id).subscribe(data => this.encuesta = data);
    }

    if (this.id) {
      // Editar encuesta
      this.editMode = true;
      this.encuestaService.getById(this.id).subscribe(data => this.encuesta = data);
    } else {
      // Crear nueva encuesta → reiniciar los campos
      this.editMode = false;
      this.encuesta = {
        id: '',
        titulo: '',
        descripcion: '',
        creadorId: '',
        fechaCreacion: new Date().toISOString(),
        estado: 'borrador'
      };
    }
  }

  async guardar() {

    if(!this.encuesta.titulo || this.encuesta.titulo.trim() === '') {
      const alert = await this.alertCtrl.create({
        header: 'Campo obligatorio',
        message: 'Debes ingresar un título para la encuesta.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.editMode) {
      this.encuestaService.update(this.id,this.encuesta).subscribe(() => this.volver());
    } else {
      this.encuestaService.create(this.encuesta).subscribe(() => this.volver());
    }
  }

  async volver() {
    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message: `Encuesta ${ this.editMode ? 'actualizada' : 'creada' } correctamente`,
      buttons: ['OK']
    });
    await alert.present();
    this.encuestaState.refrescar();
    this.router.navigate(['/encuesta-list'])
  }
}
