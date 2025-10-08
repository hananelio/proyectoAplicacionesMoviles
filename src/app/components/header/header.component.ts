import { Component, OnInit } from '@angular/core';
import {  } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Images } from '../../services/images';
import { HttpClientModule } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ CommonModule, IonicModule,
    HttpClientModule],
  standalone: true,
})
export class HeaderComponent  implements OnInit {
  pageTitle: string = '';
  images: Record<string, any> = {};

  constructor(
    private imagesService: Images,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadImages();
    
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getChildRoute(this.route))
    )
    .subscribe(snapshot => {
      this.pageTitle = snapshot?.data['title'] || 'Aplicación';
    });
    /*.subscribe((event: NavigationEnd) => {
      this.setPageTitle(event.urlAfterRedirects);
    });*/
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

  /*setPageTitle(url: string) {
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
  }*/
}

