import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, map, from, catchError, switchMap, throwError, BehaviorSubject  } from 'rxjs';
import { AuthResponse } from 'src/app/models/auth-response.model';
import { RefreshResponse } from 'src/app/models/refresh-response.model';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../collections/usuario.service';
import { Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Disponible en toda la APP
})
export class AuthRestService {
  private idToken? : string;
  private refreshToken? : string;
  private userEmail? : string;
  private tokenExpirationTime?: number;

  private userEmailSubject = new BehaviorSubject<string | undefined>(this.userEmail);
  userEmail$ = this.userEmailSubject.asObservable();

  constructor(private http: HttpClient, private injector: Injector) {
    this.loadSession();
  }

  private loadSession() {
    const savedToken = localStorage.getItem('idToken');
    const savedRefresh = localStorage.getItem('refreshToken');
    const savedEmail = localStorage.getItem('userEmail');
    const savedExpiration = localStorage.getItem('tokenExpirationTime');

    if (savedToken) this.idToken = savedToken;
    if (savedRefresh) this.refreshToken = savedRefresh;
    if (savedEmail) this.userEmail = savedEmail;
    if (savedExpiration) this.tokenExpirationTime = parseInt(savedExpiration);
  }

  /**Devuelve un token válido (refresca si está vencido) */
  getToken(): Observable<string> {
    const now = Date.now();

    if (this.idToken && this.tokenExpirationTime && now < this.tokenExpirationTime) {
      // Token válido
      return from(Promise.resolve(this.idToken));
    } else if (this.refreshToken) {
      // Token expirado → refrescar
      return this.refreshIdToken();
    } else {
      return throwError(() => new Error('No hay sesión activa'));
    }
  }
  
  getUserEmail(): string | undefined {
    return this.userEmail;
  }

  isLoggedIn(): boolean {
    return !!this.idToken;
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
    
    this.userEmailSubject.next(undefined);// Notificar cierre
  }

  signInEmailPassword(email : string, password : string) : Observable<string> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`;
    return this.http.post<AuthResponse>(url, {
      email, password, returnSecureToken: true
    }).pipe(
      tap(res => this.saveSession(res.idToken, res.refreshToken, res.email, res.expiresIn)),
      map(res => res.idToken)
    );
  }

  signInUsernameOrEmail(usernameOrEmail: string, password: string): Observable<string> {

    // Si es email válido → login directo
    if(this.isEmail(usernameOrEmail)) {
      return this.signInEmailPassword(usernameOrEmail, password);
    }

    // Carga perezosa para evitar circular dependency
    const usuarioService = this.injector.get(UsuarioService);

    // Si es username → buscar correo en Firestore
    return usuarioService.getAll().pipe(
      switchMap(users => {
        const user = users.find(u => u.username?.toLowerCase() === usernameOrEmail.toLowerCase());
        if (!user) return throwError(() => new Error('Usuario no encontrado'));
        return this.signInEmailPassword(user.email, password);
      })
    );
  }

  private isEmail(value: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(value);
  }

  private saveSession(idToken: string, refreshToken: string, email: string, expiresIn?: string) {
    this.idToken = idToken;
    this.refreshToken = refreshToken;
    this.userEmail = email;
    this.tokenExpirationTime = Date.now() + (parseInt(expiresIn ?? '3600') * 1000);

    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('tokenExpirationTime', this.tokenExpirationTime.toString());
  
    this.userEmailSubject.next(email);// Notificar cambio
  }

  /** Refrescar token si expiró */
  private refreshIdToken(): Observable<string> {
    const url = `https://securetoken.googleapis.com/v1/token?key=${environment.firebase.apiKey}`;
    if (!this.refreshToken) return from(Promise.reject('No hay refreshToken'));
    return this.http.post<RefreshResponse>(url, { grant_type: 'refresh_token', refresh_token: this.refreshToken }).pipe(
      tap(res => this.saveSession(res.id_token, res.refresh_token, this.userEmail ?? '', res.expires_in)),
      map(res => res.id_token),
      catchError(err => {
        this.signOut();
        return from(Promise.reject('Refresh token inválido'));
      })
    );
  }
}