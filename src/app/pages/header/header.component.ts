import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Images } from '../../services/core/images';
import { AuthRestService } from 'src/app/services/core/auth-rest.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule, IonicModule,
    HttpClientModule, NgIf
  ],
  standalone: true,
})
export class HeaderComponent  implements OnInit {
  pageTitle: string = '';
  userEmail: string = '';
  images: Record<string, any> = {};

  constructor(
    private imagesService: Images,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthRestService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadImages();

    this.userEmail = this.authService.getUserEmail() || 'Invitado';
    
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getChildRoute(this.route))
    )
    .subscribe(snapshot => {
      this.pageTitle = snapshot?.data['title'] || 'Aplicación';
    });
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

  // Función recursiva para obtener el snapshot de la ruta activa
  private getChildRoute(route: ActivatedRoute): ActivatedRoute['snapshot'] | null {
    let child = route.firstChild;
    while (child/*child?.firstChild*/) {
      if (child.firstChild) {
        child = child.firstChild;
      }
    }
    return route.snapshot;//return child?.snapshot || null;
  }

  async onSignOut() {
    this.authService.signOut();

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