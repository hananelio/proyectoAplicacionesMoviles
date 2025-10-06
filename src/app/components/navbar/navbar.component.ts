import { Component, OnInit } from '@angular/core';
import { IonFooter/*IonIcon*/, IonButton, IonButtons } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonToolbar } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonButtons, IonButton/*IonIcon*/, IonFooter,
    IonToolbar, CommonModule],
  standalone: true,
})
export class NavbarComponent  implements OnInit {

  constructor(private router: Router) { }
  
  navigateTo(ruta: string): void {
    this.router.navigate([`/${ruta}`]);
  }

  ngOnInit() {}

}
