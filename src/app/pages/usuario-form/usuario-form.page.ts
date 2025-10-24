import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/collections/usuario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioStateService } from 'src/app/services/core/usuario-state.servuce';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.page.html',
  styleUrls: ['./usuario-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule, RouterLink
  ]
})

export class UsuarioFormPage implements OnInit {
  usuario : Usuario = this.getEmptyUsuario();
  
  editMode = false;
  id!: string;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private usuarioState: UsuarioStateService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;

    if(this.id) {
      this.editMode = true;
      this.usuarioService.getById(this.id)
        .subscribe(data => this.usuario = data)
    } else {
      this.editMode = false;
      this.usuario = this.getEmptyUsuario();
    }
  }

  // Función que se llama al escribir nombre o apellido para generar username temporal
  actualizarUsernameTemporal() {
    const firstName = this.usuario.firstName || '';
    const lastName = this.usuario.lastName || '';
    this.usuario.username = this.normalizeStr((firstName[0] || '') + (lastName.split(' ')[0] || ''));
  }

  async guardar() {
    // Validar cédula
    if(!this.usuario.ci || this.usuario.ci.trim() === '') {
      const alert = await this.alertCtrl.create({
        header: 'Campo obligatirio',
        message: 'Debe ingresar número de cédula de identidad válido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Validar edad
    const edad = this.calcularEdad(this.usuario.fechaNacimiento);
    if (edad < 18 || edad > 70) {
      const alert = await this.alertCtrl.create({
        header: 'Edad inválida',
        message: 'Solo se permiten personas entre 18 y 70 años.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.editMode) {
      this.usuarioService.update(this.id, this.usuario)
        .subscribe(() => this.volver());
    } else {
      // Genera username real y verifica duplicados antes de crear
      this.usuarioService.generarUsername(this.usuario.firstName, this.usuario.lastName)
        .subscribe(async username => {
          this.usuario.username = username;
          this.usuario.password = `${this.usuario.ci}${this.usuario.extension ?? ''}*`;
          this.usuarioService.create(this.usuario)
            .subscribe(() => this.volver());
        });
      }
    }

  async volver() {
    const alert = await this.alertCtrl.create ({
      header: 'Éxito',
      message: `Encuesta ${ this.editMode ? 'actualizada' : 'creada' } corectamente`,
      buttons: ['OK']
    });
    await alert.present();
    this.usuarioState.refrescar();
    this.router.navigate(['/usuario-list'])
  }

  generarUsernameTemporal() {
    if(this.usuario.firstName && this.usuario.lastName) {
      // Llamamos a la función normalizeStr de UsuarioService
      this.usuario.username = this.usuarioService['normalizeStr'](
        (this.usuario.firstName[0] || '') + this.usuario.lastName.split(' ')[0]
      );
    }
  }

  private calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  private getEmptyUsuario(): Usuario {
    return {
      uid: '',
      id: '',
      ci: '',
      complemento: '',
      extension: 'Sc',
      firstName: '',
      lastName: '',
      fechaNacimiento: '',
      fechaCreacion: new Date().toISOString(),
      sexo: undefined,
      telefono: '',
      email: '',
      password: '',
      username: '',
      rol: 'encuestador',
      estado: 'activo'
    };
  }

  // Normaliza quitando acentos y caracteres especiales
  private normalizeStr(s: string) {
    return s.normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')  // quita acentos
            .replace(/[^a-zA-Z0-9]/g, '')     // quita caracteres no alfanuméricos
            .toLowerCase();
  }
}
