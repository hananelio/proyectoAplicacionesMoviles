import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';

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
  },
  {
    path: 'encuesta-list',
    loadComponent: () => import('./pages/encuesta-list/encuesta-list.page')
      .then( m => m.EncuestaListPage),
    
    data: { title: 'Encuestas' },
    canActivate: [authGuard]   // 🔒 protegida
  },

  {
    path: 'encuesta-form',
    loadComponent: () => import('./pages/encuesta-form/encuesta-form.page')
      .then(m => m.EncuestaFormPage),
    
    canActivate: [authGuard]
  },

  //✅ Rutas para CRUD
  {
    path: 'encuesta/nueva',
    loadComponent: () => import('./pages/encuesta-form/encuesta-form.page')
      .then(m => m.EncuestaFormPage),
    
    canActivate: [authGuard]
  },
  {
    path: 'encuesta/editar/:id',
    loadComponent: () => import('./pages/encuesta-form/encuesta-form.page')
      .then(m => m.EncuestaFormPage),

    canActivate: [authGuard]
  },
  {
    path: 'encuesta/detalle/:id',
    loadComponent: () => import('./pages/encuesta-detail/encuesta-detail.page')
      .then(m => m.EncuestaDetailPage),
    
    canActivate: [authGuard]
  }
];
