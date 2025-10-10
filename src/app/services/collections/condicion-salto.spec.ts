import { TestBed } from '@angular/core/testing';

import { CondicionSalto } from './condicion-salto';

describe('CondicionSalto', () => {
  let service: CondicionSalto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CondicionSalto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
