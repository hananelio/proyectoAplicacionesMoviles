import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, map, from, catchError  } from 'rxjs';
import { AuthResponse } from 'src/app/models/auth-response.model';
import { RefreshResponse } from 'src/app/models/refresh-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'  // Disponible en toda la APP
})
export class AuthRestService {
  private idToken? : string;
  private refreshToken? : string;
  private userEmail? : string;
  private tokenExpirationTime?: number;

  constructor(private http : HttpClient) {
    const savedToken = localStorage.getItem('idToken');
    const savedRefresh = localStorage.getItem('refreshToken');
    const savedEmail = localStorage.getItem('userEmail');
    const savedExpiration = localStorage.getItem('tokenExpirationTime');
    
    if (savedToken && savedEmail) {
      this.idToken = savedToken;
      this.userEmail = savedEmail;
    }

    if (savedToken && savedEmail && savedRefresh) {
      this.idToken = savedToken;
      this.refreshToken = savedRefresh;
      this.userEmail = savedEmail;
    }

    if (savedExpiration) {
      this.tokenExpirationTime = parseInt(savedExpiration);
    }
  }

  /* Devuelve un token válido (refresca si está vencido) */
  getToken(): Observable<string> {
    //const expiration = localStorage.getItem('tokenExpirationTime');
    const now = Date.now();

    if (this.idToken && this.tokenExpirationTime && now < this.tokenExpirationTime /*parseInt(expiration)*/) {
      // Token válido
      return from(Promise.resolve(this.idToken));
    } else if (this.refreshToken) {
      // Token expirado → refrescar
      return this.refreshIdToken().pipe(
        catchError(err => {
          this.signOut(); // Limpiar sesión si refresh falla
          return from(Promise.reject('No hay sesión activa'));
        })
      );
    } else {
      // Sin sesión activa
      return from(Promise.reject('No hay sesión activa'));
    }
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
        this.refreshToken = res.refreshToken;
        this.userEmail = res.email;

        this.tokenExpirationTime = Date.now() + parseInt(res.expiresIn ?? '3600') * 1000;

        // 👇 Guardar sesión en localStorage
        localStorage.setItem('idToken', res.idToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('userEmail', res.email);
        localStorage.setItem('tokenExpirationTime', this.tokenExpirationTime.toString());
      }),
      map(res => res.idToken)
    );
  }

  /** Refrescar token si expiró */
  private refreshIdToken(): Observable<string> {
    const url = `https://securetoken.googleapis.com/v1/token?key=${environment.firebase.apiKey}`;

    if (!this.refreshToken) {
      this.signOut(); // limpiar tokens inválidos
      return from(Promise.reject('No se puede refrescar: no hay refreshToken'));
    }

    return this.http.post<RefreshResponse>(url, {
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    }).pipe(
      tap(res => {
        this.idToken = res.id_token;
        this.refreshToken = res.refresh_token;
        this.tokenExpirationTime = Date.now() + parseInt(res.expires_in ?? '3600') * 1000;

        localStorage.setItem('idToken', this.idToken);
        localStorage.setItem('refreshToken', this.refreshToken);
        localStorage.setItem('tokenExpirationTime', this.tokenExpirationTime.toString());
      }),
      map(res => res.id_token),

    // Si el refresh falla, limpiar sesión
    catchError(err => {
      this.signOut();
      return from(Promise.reject('Refresh token inválido, cierre de sesión'));
    })
    );
  }

  signOut(){
    this.idToken = undefined;
    this.userEmail = undefined;
    this.refreshToken = undefined;
    this.tokenExpirationTime = undefined;
    
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('tokenExpirationTime');
  }

  isLoggedIn(): boolean {
    return !!this.idToken;
  }
}
