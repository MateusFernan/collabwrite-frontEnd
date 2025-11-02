import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { NewDocResolver } from './core/resolvers/new-doc.resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '',
    component: LayoutComponent, // mantém seu <nav> fixo
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'documents', pathMatch: 'full' },
      {
        path: 'documents',
        loadComponent: () =>
          import('./pages/documents/documents.component').then(
            (m) => m.DocumentsComponent
          ),
      },
      {
        path: 'editor/new',
        resolve: { doc: NewDocResolver },
        loadComponent: () =>
          import(
            './pages/editor/new-doc-redirect/new-doc-redirect.component.ts.component'
          ).then((m) => m.NewDocRedirectComponent),
      },
      {
        path: 'editor/:id',
        loadComponent: () =>
          import('./pages/editor/editor.component').then(
            (m) => m.EditorComponent
          ),
      },
    ],
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('./pages/explore/explore.component').then(
        (m) => m.ExploreComponent
      ),
  },

  { path: '**', redirectTo: 'explore' },
];
