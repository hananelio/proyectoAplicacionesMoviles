import { TestBed } from '@angular/core/testing';

import { Respuesta } from './respuesta';

describe('Respuesta', () => {
  let service: Respuesta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Respuesta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
