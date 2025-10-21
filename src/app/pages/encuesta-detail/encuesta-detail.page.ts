import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Encuesta  } from 'src/app/models/encuesta.model';
import { EncuestaService } from 'src/app/services/collections/encuesta.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-encuesta-detail',
  templateUrl: './encuesta-detail.page.html',
  styleUrls: ['./encuesta-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule
  ]
})
export class EncuestaDetailPage implements OnInit {
  encuesta?: Encuesta;

  constructor(
    private encuestaService: EncuestaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.encuestaService.getById(id).subscribe(data => this. encuesta = data);
  }

  volver() {
    this.router.navigate(['/encuestas'])
  }
}
