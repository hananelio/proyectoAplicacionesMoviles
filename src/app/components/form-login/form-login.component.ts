import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {  } from "@ionic/angular/standalone";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Images } from '../../services/images';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule,
    HttpClientModule, CommonModule
  ]
})
export class FormLoginComponent  implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  loginError = ''; 
  images: Record<string, any> = {};
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private imagesService: Images//private http: HttpClient
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {
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
  
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  async loadImages() {
    try {
      this.images = await this.imagesService.loadImages();
      console.log('Images cargadas:', this.images);
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
    const { email, password } = this.loginForm.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      await this.router.navigateByUrl('/home', { replaceUrl: true }); // o redirige a otra página si tienes
    } catch (error: any) {
      this.loginError = this.getFirebaseErrorMessage(error.code);
    }

    this.isSubmitting = false;
  }

  private getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'Usuario no registrado.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-email':
        return 'Correo inválido.';
      default:
        return 'Error al iniciar sesión.';
    }
  }

}
