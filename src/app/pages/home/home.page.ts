import { IonicModule } from '@ionic/angular';
import { Component} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
//import { FormLoginComponent } from '../form-login/form-login.component';
//aumento de imports
import {  } from "@ionic/angular/standalone";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRestService } from 'src/app/services/core/auth-rest.service';
//import { Authentication } from 'src/app/services/core/authentication';
//import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Images } from '../../services/core/images';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonicModule, ReactiveFormsModule,
    HttpClientModule, NgIf
  ]
})
export class HomePage { //FormLoginComponent
  loginForm!: FormGroup;
  isSubmitting = false;
  loginError = ''; 
  images: Record<string, any> = {};
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authentication: AuthRestService,
    private imagesService: Images//private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      //email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {
    this.checkSession();
    this.loadImages();
  }
  /*async ngOnInit() {
    try {
      this.images = await this.imagesService.loadImages();
      console.log('Images cargadas:', this.images);
    } catch (err) {
      console.error('Error cargando images.json', err);
      this.images = {}; // evita errores en el template
    }
  }*/
  
  //get email() { return this.loginForm.get('email'); }
  //get password() { return this.loginForm.get('password'); }
  private checkSession () {
    this.authentication.getToken().subscribe({
      next: token => {
        console.log('Token válido encontrado:', token);
        this.router.navigateByUrl('/inicio');
      },
      error: err => {
        console.log('No hay sesión activa:', err);
      }
    });
    /*const token = this.authentication.getToken();
    if (token) {
      this.router.navigateByUrl('/inicio');
    }*/
  }

  async loadImages() {
    try {
      // Cargar imágenes (cacheadas si ya existen)
      this.images = this.imagesService.getImages() || await this.imagesService.loadImages();
      //this.images = await this.imagesService.loadImages();
      
      Object.keys(this.images).forEach(key => {
        console.log(`Imagen cargada: ${key}`);
      });
      //console.log('Images cargadas:'/*, this.images*/);
    } catch (err) {
      console.error('Error cargando images.json', err);
      this.images = {};
    }
  }

  async onSubmit() {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { usernameOrEmail, password } = this.loginForm.value;
    
    this.authentication.signInUsernameOrEmail(usernameOrEmail, password).subscribe({
      next: token => {
        console.log('Token recibido:', token.slice(0, 20) + '...');
        const localToken = localStorage.getItem('idToken');
        console.log('📦 LocalStorage:', localToken ? localToken.slice(0,20) + '...': '(sin token');
        this.router.navigateByUrl('/inicio', { replaceUrl: true });
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loginError = this.getFirebaseErrorMessage(err);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  private getFirebaseErrorMessage(message: string): string {
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        return 'Usuario o correo no registrado.';
      case 'INVALID_PASSWORD':
        return 'Contraseña incorrecta.';
      case 'INVALID_EMAIL':
        return 'Correo inválido.';
      default:
        return 'Error al iniciar sesión.';
    }
  }
}