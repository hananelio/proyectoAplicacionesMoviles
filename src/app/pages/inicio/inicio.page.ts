import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule, HeaderComponent, RouterLink
  ] 
})
export class InicioPage {
  constructor(private router: Router) { }

  goToCrearEncuesta() {
    this.router.navigateByUrl('/crear-encuesta');
  }

  goToVerEncuestas() {
    this.router.navigateByUrl('/mis-encuestas');
  }
}

