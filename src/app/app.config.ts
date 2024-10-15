import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
    provideToastr({
        timeOut: 5000, // Default display time in milliseconds
        closeButton: true, // Show a close button
        progressBar: true, // Show a progress bar
        preventDuplicates: true, // Prevent duplicate toasts
        tapToDismiss: true, // Allow dismissal on click
      })
  ]
};
