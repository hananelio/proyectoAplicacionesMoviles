import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/collections/usuario.service';
import { RouterLink } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { Location } from '@angular/common';
import { UsuarioStateService } from 'src/app/services/core/usuario-state.servuce';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.page.html',
  styleUrls: ['./usuario-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule,
    RouterLink, HeaderComponent
  ]
})
export class UsuarioListPage implements OnInit, OnDestroy {

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargando = true;
  terminoBusqueda: string = '';

  private sub!: Subscription;
  
  constructor(
    private usuarioService: UsuarioService,
    private alertCtrl: AlertController,
    private usuarioState: UsuarioStateService,
    private location: Location
  ) { }
  
  ngOnInit() {
    this.sub = this.usuarioState.usuarios$.subscribe(
      data => {
        this.usuarios = data;
        //this.usuarios = data.filter(u => u.estado === 'activo');
        this.usuariosFiltrados = this.usuarios.filter(u => u.estado === 'activo');
        //this.filtrarUsuarios();
        this.cargando = false;
    });
    
    this.usuarioState.refrescar();    
  }

  ngOnDestroy() {
    // 🔒 Evita fugas de memoria al salir de la página
    if (this.sub) this.sub.unsubscribe();
  }

  filtrarUsuarios() {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (!termino) {
      this.usuariosFiltrados = this.usuarios.filter(u => u.estado === 'activo');
    } else {
      this.usuariosFiltrados = this.usuarios.filter(u =>
        u.firstName.toLowerCase().includes(termino) ||
        u.lastName.toLowerCase().includes(termino) ||
        u.email.toLowerCase().includes(termino) ||
        u.username.toLowerCase().includes(termino)
      );
    }
  }

  //activar usuario
  async activarUsuario(usuario: Usuario) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Deseas volver a activar al usuario ${usuario.firstName} ${usuario.lastName}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Activar',
          handler: () => {
            this.usuarioService.habilitacionCompleta(usuario).subscribe({
              next: async (u) => {
                
                this.terminoBusqueda = '';
                this.usuarioState.refrescar();
                this.filtrarUsuarios();

                const alerta = await this.alertCtrl.create({
                  header: 'Éxito',
                  message: 'Usuario activado correctamente',
                  buttons: ['OK']
                });
                await alerta.present();
                console.log('Usuario eliminado correctamente de Auth y Firestore');
              },
              error: async (err) => {
                console.error('Error al activar usuario', err);
                const alerta = await this.alertCtrl.create({
                  header: 'Error',
                  message: 'No se pudo activar al usuario',
                  buttons: ['OK']
                });
                await alerta.present();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }


  async eliminarLogicaUsuario(usuario: Usuario) {
    const alert = await this.alertCtrl.create ({
      header: 'Confirmar',
      message: `¿Eliminar al usuario ${usuario.firstName.toUpperCase()} ${usuario.lastName.toUpperCase()}?`,
      buttons : [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar',
          handler: async() => {

            this.usuarioState.eliminarLocal(usuario.id);

            //delete(usuario.id)
            this.usuarioService.deleteLogicoCompleto(usuario).subscribe({
              next: async() => {
                this.usuarioState.refrescar();
                const alert = await this.alertCtrl.create({
                  header: 'Éxito',
                  message: 'Usuario eliminado correctamente',
                  buttons: ['OK']
                })
                await alert.present();
                console.log('Usuario eliminado correctamente de Auth y Firestore');
              },
              error: async(err) => {
                let msg = 'Error desconocido';
                if (err.status === 404) msg = 'El usuario ya no existe.';
                else if (err.error?.message) msg = err.error.message;
                
                console.error('Error al eliminar', err);
                this.usuarioState.refrescar();

                const alert = await this.alertCtrl.create ({
                  header: 'Error',
                  message: msg,
                  buttons: ['OK']
                });
                await alert.present();
              }
            })
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarUsuario(usuario: Usuario) {
    const alert = await this.alertCtrl.create ({
      header: 'Confirmar',
      message: `¿Eliminar al usuario ${usuario.firstName.toUpperCase()} ${usuario.lastName.toUpperCase()}?`,
      buttons : [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar',
          handler: async() => {

            this.usuarioState.eliminarLocal(usuario.id);

            //delete(usuario.id)
            this.usuarioService.deleteCompleto(usuario).subscribe({
              next: async() => {
                this.usuarioState.refrescar();
                const alert = await this.alertCtrl.create({
                  header: 'Éxito',
                  message: 'Usuario eliminado correctamente',
                  buttons: ['OK']
                })
                await alert.present();
                console.log('Usuario eliminado correctamente de Auth y Firestore');
              },
              error: async(err) => {
                let msg = 'Error desconocido';
                if (err.status === 404) msg = 'El usuario ya no existe.';
                else if (err.error?.message) msg = err.error.message;
                
                console.error('Error al eliminar', err);
                this.usuarioState.refrescar();

                const alert = await this.alertCtrl.create ({
                  header: 'Error',
                  message: msg,
                  buttons: ['OK']
                });
                await alert.present();
              }
            })
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