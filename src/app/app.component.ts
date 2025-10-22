import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthRestService } from './services/core/auth-rest.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private auth: AuthRestService) {
    this.auth.signOut(); // Fuerza cierre de sesión al arrancar
  }
}
