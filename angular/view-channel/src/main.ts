
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

// Needed so StackBlitz works
import 'zone.js';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations()
  ]
});
