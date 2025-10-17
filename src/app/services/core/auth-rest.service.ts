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

  constructor(private http : HttpClient) { }

  getToken() : string | undefined {
    return this.idToken;
  }

  signInEmailPassword(email : string, password : string) : Observable<string> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`;
    return this.http.post<AuthResponse>(url, {
      email, password, returnSecureToken: true
    }).pipe(
      tap(res => this.idToken = res.idToken),
      map(res => res.idToken)
    );
  }

  signOut(){
    this.idToken = undefined;
  }
}
