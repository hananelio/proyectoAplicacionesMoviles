import { Component, OnInit } from '@angular/core';
import { IonTitle, IonToolbar, IonHeader, IonButtons } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonMenuButton } from "@ionic/angular/standalone";
import { Images } from '../../services/images';
import { HttpClientModule } from '@angular/common/http';

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
  images: Record<string, any> = {};

  constructor(private imagesService: Images) { }

  ngOnInit() {
    this.loadImages();
  }

  async loadImages() {
    try {
      this.images = await this.imagesService.loadImages();
      console.log('Images cargadas:', this.images);
    } catch (err) {
      console.error('Error cargando images.json', err);
      this.images = {};
    }
  }
}
