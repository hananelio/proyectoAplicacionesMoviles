import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { AuthResponse } from 'src/app/models/auth-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'  // Disponible en toda la APP
})
export class AuthRestService {
  private idToken? : string;
  private userEmail? : string;

  constructor(private http : HttpClient) {
    const savedToken = localStorage.getItem('idToken');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedToken && savedEmail) {
      this.idToken = savedToken;
      this.userEmail = savedEmail;
    }
  }

  getToken() : string | undefined {
    return this.idToken;
  }
  
  getUserEmail(): string | undefined {
    return this.userEmail;
  }

  signInEmailPassword(email : string, password : string) : Observable<string> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`;
    return this.http.post<AuthResponse>(url, {
      email, password, returnSecureToken: true
    }).pipe(
      tap(res => {
        this.idToken = res.idToken;
        this.userEmail = res.email;

        // 👇 Guardar sesión en localStorage
        localStorage.setItem('idToken', res.idToken);
        localStorage.setItem('userEmail', res.email);
      }),
      map(res => res.idToken)
    );
  }

  signOut(){
    this.idToken = undefined;
    this.userEmail = undefined;
    localStorage.removeItem('idToken');
    localStorage.removeItem('userEmail');
  }

  isLoggedIn(): boolean {
    return !!this.idToken;
  }
}
