import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'explore', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'explore', loadComponent: () => import('./pages/explore/explore.component').then(m => m.ExploreComponent) },
  {
    path: 'documents',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/documents/documents.component').then(m => m.DocumentsComponent)
  },
  {
    path: 'editor/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/editor/editor.component').then(m => m.EditorComponent)
  },
  { path: '**', redirectTo: 'explore' }
];
