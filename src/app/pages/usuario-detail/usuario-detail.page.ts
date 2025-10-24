import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/collections/usuario.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";


@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.page.html',
  styleUrls: ['./usuario-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule, FormsModule, HeaderComponent,
    RouterLink, RouterModule
  ]
})
export class UsuarioDetailPage implements OnInit {
  usuario?: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.usuarioService.getById(id).subscribe(data => this. usuario = data);
  }

}
