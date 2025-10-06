import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Images {
  private images: any = null;

  constructor(private http: HttpClient) { }

  async loadImages(): Promise<any> {
    if (this.images) {
      return this.images;
    }
    this.images = await firstValueFrom(this.http.get('assets/images.json'));
    return this.images;
  }

   // Método para obtener las imágenes sin recargar
  getImages(): any {
    return this.images;
  }
  
}
