import { TestBed } from '@angular/core/testing';

import { CondicionSaltoService } from './condicion-salto.service';

describe('CondicionSaltoService', () => {
  let service: CondicionSaltoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CondicionSaltoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
