import { Component, OnInit } from '@angular/core';
import { AuthRestService } from './services/core/auth-rest.service';
import { IonicModule, ToastController } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { documentTextOutline, gitBranchOutline, homeOutline, logOutOutline, peopleOutline } from 'ionicons/icons';
import { Images } from './services/core/images';
import { Router } from '@angular/router';
import { registerGlobalIcons } from './core/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent implements OnInit {
  
  userEmail: string = '';
  images: Record<string, any> = {};
  
  constructor(
    private auth: AuthRestService,
    private imagesService: Images,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.auth.signOut();
    registerGlobalIcons();
  }

  ngOnInit() {
    this.loadImages();

    this.auth.userEmail$.subscribe(email => {
      this.userEmail = email || 'Invitado';
      //this.userEmail = this.auth.getUserEmail() || 'Invitado';
    })
  }

  async loadImages() {
    try {
      this.images = this.imagesService.getImages() || await this.imagesService.loadImages();
      
      Object.keys(this.images).forEach(key => {
        console.log(`Imagen cargada: ${key}`);
      });
      
    } catch (err) {
      console.error('Error cargando images.json', err);
      this.images = {};
    }
  }

  async onSignOut() {
    this.auth.signOut();

    const toast = await this.toastCtrl.create({
      message: 'Sesión cerrada correctamente',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });

    await toast.present();
    this.router.navigate(['/home'])
  }
}
