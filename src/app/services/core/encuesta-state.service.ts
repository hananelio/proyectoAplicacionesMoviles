import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class EncuestaStateService {
  private refrescarLista = new Subject<void>();
  refrescar$ = this.refrescarLista.asObservable();

  refrescar() {
    this.refrescarLista.next();
  }
}
