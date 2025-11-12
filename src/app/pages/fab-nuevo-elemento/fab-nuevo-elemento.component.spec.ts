import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FabNuevoElementoComponent } from './fab-nuevo-elemento.component';

describe('FabNuevoElementoComponent', () => {
  let component: FabNuevoElementoComponent;
  let fixture: ComponentFixture<FabNuevoElementoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FabNuevoElementoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FabNuevoElementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
