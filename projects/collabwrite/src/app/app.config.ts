import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { QuillModule } from 'ngx-quill';
import { authInterceptor } from './core/services/interceptors/auth.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    [importProvidersFrom(QuillModule.forRoot())],
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
