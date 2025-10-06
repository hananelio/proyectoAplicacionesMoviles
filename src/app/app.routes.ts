import { Routes } from '@angular/router';
import { HomePage } from './home/home.page'; // ajusta la ruta si es necesario


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
