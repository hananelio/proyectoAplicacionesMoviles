import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuestaDetailPage } from './encuesta-detail.page';

describe('EncuestaDetailPage', () => {
  let component: EncuestaDetailPage;
  let fixture: ComponentFixture<EncuestaDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
