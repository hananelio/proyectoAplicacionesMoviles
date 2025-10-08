import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class Autentication {
  private auth = inject(Auth); // ✅ garantiza el contexto de inyección
   
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
}
