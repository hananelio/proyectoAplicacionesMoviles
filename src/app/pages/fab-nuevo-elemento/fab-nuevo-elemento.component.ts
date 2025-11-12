import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fab-nuevo-elemento',
  standalone: true,
  templateUrl: './fab-nuevo-elemento.component.html',
  styleUrls: ['./fab-nuevo-elemento.component.scss'],
  imports: [ IonicModule, RouterModule, CommonModule ],
})
export class FabNuevoElementoComponent  implements OnInit {
  @Input() visible: boolean = true;
  @Input() ruta: string = '/';

  constructor() { }

  ngOnInit() {}

}
