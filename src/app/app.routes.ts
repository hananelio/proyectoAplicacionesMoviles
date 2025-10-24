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

  //---------- ENCUESTA ----------
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

  //---------- USUARIO ----------
  {
    path: 'usuario-list',
    loadComponent: () => import('./pages/usuario-list/usuario-list.page')
      .then( m => m.UsuarioListPage),
    
    data: { title: 'Usuarios' },
    canActivate: [authGuard]   // 🔒 protegida
  },

  {
    path: 'usuario-form',
    loadComponent: () => import('./pages/usuario-form/usuario-form.page')
      .then( m => m.UsuarioFormPage),

    canActivate: [authGuard]
  },

  //✅ Rutas para CRUD ENCUESTA
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
    
    data: { title: 'Detalle de Encuesta' },
    canActivate: [authGuard]
  },

  //✅ Rutas para CRUD USUARIO
  {
    path: 'usuario/nueva',
    loadComponent: () => import('./pages/usuario-form/usuario-form.page')
      .then(m => m.UsuarioFormPage),
    
    canActivate: [authGuard]
  },
  {
    path: 'usuario/editar/:id',
    loadComponent: () => import('./pages/usuario-form/usuario-form.page')
      .then(m => m.UsuarioFormPage),

    canActivate: [authGuard]
  },
  {
    path: 'usuario/detalle/:id',
    loadComponent: () => import('./pages/usuario-detail/usuario-detail.page')
      .then(m => m.UsuarioDetailPage),
    
      data: { title: 'Detalle de Usuario' },
    canActivate: [authGuard]
  },
];
