
import { addIcons } from 'ionicons';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { mailOpenOutline, lockClosedOutline } from 'ionicons/icons';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { provideStorage, getStorage } from '@angular/fire/storage';

const firebaseConfig = {
  projectId: 'appencuestabd',
  appId: '1:765801133121:web:7ff2d7ddee72e87b8e82c0',
  storageBucket: 'appencuestabd.appspot.com',
  apiKey: 'AIzaSyBnB85iMGWfozIK-0FGSwjCKRIZNLU_JAc',
  authDomain: 'appencuestabd.firebaseapp.com',
  messagingSenderId: '765801133121'
};

// Registrar iconos manualmente
addIcons({
  'mail-open-outline': mailOpenOutline,
  'lock-closed-outline': lockClosedOutline
});

// Inicializa los elementos PWA de Ionic
defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(HttpClientModule),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage())
  ]
});