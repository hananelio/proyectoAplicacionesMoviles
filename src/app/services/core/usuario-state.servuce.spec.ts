import { TestBed } from '@angular/core/testing';

import { UsuarioStateServuce } from './usuario-state.servuce';

describe('UsuarioStateServuce', () => {
  let service: UsuarioStateServuce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioStateServuce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
