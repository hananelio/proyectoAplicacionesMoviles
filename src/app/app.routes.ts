import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page'; // ajusta la ruta si es necesario


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    data: { title: 'Home' }
  },
  {
    path: 'inicio',
    loadComponent: () => 
      import('./pages/inicio/inicio.page').then( (m) => m.InicioPage),
    data: { title: 'Inicio' }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];
