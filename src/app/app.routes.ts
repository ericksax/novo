import { Routes } from '@angular/router';
import { isAuthenticated } from './guards/is-authenticated.guard';
import { isAdmin } from './guards/is-admin.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
      canActivate: [isAuthenticated]
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
      canActivate: [isAuthenticated, isAdmin]
  },
  {
    path: 'document',
    loadComponent: () =>
      import('./pages/document/document.page').then((m) => m.DocumentPage),
      canActivate: [isAuthenticated, isAdmin]
  },
  {
    path: 'notfound',
    loadComponent: () => import('./pages/notfound/notfound.page').then( m => m.NotfoundPage)
  },
  {
    path: 'not-authorized',
    loadComponent: () => import('./pages/not-authorized/not-authorized.page').then( m => m.NotAuthorizedPage)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios.page').then( m => m.UsuariosPage)
  },
  {
    path: '**',
    redirectTo: 'notfound',
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios.page').then( m => m.UsuariosPage)
  }

];
