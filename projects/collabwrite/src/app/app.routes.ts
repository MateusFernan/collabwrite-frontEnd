import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { NewDocResolver } from './core/resolvers/new-doc.resolver';
import { logoutResolver } from './core/resolvers/logout.resolver';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    resolve: { loggedOut: logoutResolver },
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    component: LayoutComponent,
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
      {
        path: 'editor-colab/:id',
        loadComponent: () =>
          import('./pages/editor-colab/editor-colab.component').then(
            (m) => m.EditorColabComponent
          ),
      },
      {
        path: 'read/:id',
        loadComponent: () =>
          import('./pages/text-reader/text-reader.component').then(
            (m) => m.TextReaderComponent
          ),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./pages/explore/explore.component').then(
            (m) => m.ExploreComponent
          ),
      },
      {
        path: 'editor-colab',
        loadComponent: () =>
          import('./pages/editor-colab/editor-colab.component').then(
            (m) => m.EditorColabComponent
          ),
      },
      {
        path: 'share/:id',
        loadComponent: () =>
          import('./pages/shared-redirect/shared-redirect.component').then(
            (m) => m.ShareRedirectComponent
          ),
      },
    ],
  },
];
