import { TestBed } from '@angular/core/testing';

import { SaltoPreguntaService } from './salto-pregunta.service';

describe('SaltoPreguntaService', () => {
  let service: SaltoPreguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaltoPreguntaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
