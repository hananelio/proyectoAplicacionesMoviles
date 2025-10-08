import { Component, OnInit } from '@angular/core';
import { IonTitle, IonToolbar, IonHeader, IonButtons } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonMenuButton } from "@ionic/angular/standalone";
import { Images } from '../../services/images';
import { HttpClientModule } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonButtons, IonHeader, IonToolbar,
    IonMenuButton, IonTitle, CommonModule,
    HttpClientModule],
  standalone: true,
})
export class HeaderComponent  implements OnInit {
  pageTitle: string = '';
  images: Record<string, any> = {};

  constructor(private imagesService: Images, private router: Router) { }

  ngOnInit() {
    this.loadImages();
    
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.setPageTitle(event.urlAfterRedirects);
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

  setPageTitle(url: string) {
    switch (url) {
      case '/inicio':
        this.pageTitle = 'Inicio';
        break;
      case '/menu':
        this.pageTitle = 'Menú';
        break;
      case '/perfil':
        this.pageTitle = 'Perfil';
        break;
      default:
        this.pageTitle = '';
    }
  }
}
/*export class HeaderComponent  implements OnInit {
  pageTitle: string = '';
  images: Record<string, any> = {};

  constructor(private imagesService: Images, private router: Router) { }

  ngOnInit() {
    this.loadImages();
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setPageTitle(event.urlAfterRedirects);
      });
  }

  async loadImages() {
    try {
      this.images = this.imagesService.getImages() || await this.imagesService.loadImages();
      Object.keys(this.images).forEach(key => console.log(`Imagen cargada: ${key}`));
    } catch (err) {
      console.error('Error cargando images.json', err);
      this.images = {};
    }
  }

  // ✅ Este método debe estar dentro de la clase
  setPageTitle(url: string) {
    switch (url) {
      case '/inicio':
        this.pageTitle = 'Inicio';
        break;
      case '/menu':
        this.pageTitle = 'Menú';
        break;
      case '/perfil':
        this.pageTitle = 'Perfil';
        break;
      default:
        this.pageTitle = '';
    }
  }
}*/

