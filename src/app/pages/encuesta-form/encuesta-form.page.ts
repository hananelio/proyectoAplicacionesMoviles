import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Encuesta } from 'src/app/models/encuesta.model';
import { EncuestaService } from 'src/app/services/collections/encuesta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular'
import { EncuestaStateService } from 'src/app/services/core/encuesta-state.service';
import { PreguntaListComponent } from '../pregunta-list/pregunta-list.component';
import { Pregunta } from 'src/app/models/pregunta.model';
import { PreguntaService } from 'src/app/services/collections/pregunta.service';
import { Respuesta } from 'src/app/models/respuesta.model';
import { RespuestaService } from 'src/app/services/collections/respuesta.service';
@Component({
  selector: 'app-encuesta-form',
  templateUrl: './encuesta-form.page.html',
  styleUrls: ['./encuesta-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule,
    ReactiveFormsModule, PreguntaListComponent
  ]
})
export class EncuestaFormPage implements OnInit {
  encuesta: Encuesta = { //Inicializa la encuesta vacía por defecto
    id: '',
    titulo: '',
    descripcion: '',
    creadorId: '',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: '',
    fechaPublicacion: '',
    fechaCierre: '',
    estado: 'borrador'
  };

  editMode = false; //indica si el formulario está en modo edición o creación.
  id!: string; //almacena el parámetro id obtenido desde la URL (/encuesta/editar/:i
  preguntas: Pregunta[] = [];
  preguntaEditandoId: string | null = null;
  @Input() editandoEncuesta: boolean = false;
  usuario: any;

  constructor( // Inyecta servicios que el componente necesita
    private encuestaService: EncuestaService, //acceder, crear o editar encuestas.
    private preguntaService: PreguntaService,
    private respuestaService: RespuestaService,
    private route: ActivatedRoute, //leer el parámetro id de la ruta.
    private router: Router, //navegar entre vistas.
    private alertCtrl: AlertController, //mostrar mensajes al usuario.
    private encuestaState: EncuestaStateService
  ) { }
  //**coloca en el ciclo de vida la encuesta */
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    
    if (this.id) {
      // Editar encuesta
      this.editMode = true;
      this.encuestaService.getById(this.id)
        .subscribe(data => this.encuesta = data);

        // Cargar preguntas asociadas
        this.preguntaService.getAll(this.id)
          .subscribe( pregs => {
            this.preguntas = pregs.sort((a,b) => a.orden - b.orden);
        })
    } else {
      // Crear nueva encuesta → reiniciar los campos
      this.editMode = false;
      this.encuesta = {
        id: '',
        titulo: '',
        descripcion: '',
        creadorId: '',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        fechaPublicacion: new Date(0).toISOString(),
        fechaCierre: new Date(0).toISOString(),
        estado: 'borrador'
      };
    }
  }
  /**Permite guardar la encuesta */
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
      this.encuestaService.update(this.id, this.encuesta)
        .subscribe(() => this.volver());
    } else {
      this.encuestaService.create(this.encuesta)
        .subscribe(enc => {
          this.encuesta = enc;
          this.id = enc.id;
          this.volver()
        });
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

  /**Permite agregar preguntas al final */
  agregarPreguntaFinal() {
    if(!this.id) return; // Solo agregar si la encuesta ya tiene id
    
    const nueva: Pregunta = {
      idEncuesta: this.id,
      texto: 'Nueva pregunta',
      tipo: 'texto',
      opciones: [],
      obligatorio: false,
      orden: this.preguntas.length + 1
    };

    this.preguntas.push(nueva);

    this.preguntaService.create(nueva).subscribe(resp => {
      if(resp?.id) nueva.id = resp.id;
    });
  }
  /**Permite guardar/actualizar preguntas al final */
  guardarPregunta() {
    this.preguntas.forEach(p => {
      if(p.id) {
        this.preguntaService.update(this.id, p.id, p).subscribe();
      } else {
        this.preguntaService.create(p).subscribe(resp => p.id = resp.id)
      }
    })
  }

  activarEdicion(idPregunta: string) {
    this.preguntaEditandoId = idPregunta;
  }

  desactivarEdicion() {
    this.preguntaEditandoId = null;
  }

onRespuestaSeleccionada(event: { idPregunta: string, valor: any }) {
  const nuevaRespuesta: Respuesta = {
    idPregunta: event.idPregunta,
    idUsuario: this.usuario.id,
    respuestas: { valor: event.valor }, // o más campos si quieres
    fechaEnvio: new Date(),
    estado: 'borrador'
  };

  this.respuestaService.guardarRespuesta(nuevaRespuesta);
}
}
