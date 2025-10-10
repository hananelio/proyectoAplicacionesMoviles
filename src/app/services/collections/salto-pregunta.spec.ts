import { TestBed } from '@angular/core/testing';

import { SaltoPregunta } from './salto-pregunta';

describe('SaltoPregunta', () => {
  let service: SaltoPregunta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaltoPregunta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
