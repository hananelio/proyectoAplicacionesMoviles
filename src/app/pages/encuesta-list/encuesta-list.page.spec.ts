import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuestaListPage } from './encuesta-list.page';

describe('EncuestaListPage', () => {
  let component: EncuestaListPage;
  let fixture: ComponentFixture<EncuestaListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
