import { IonicModule } from '@ionic/angular';
import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLoginComponent } from '../components/form-login/form-login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonicModule, FormLoginComponent
  ]
})
export class HomePage {

  constructor( ) { }
  
}


