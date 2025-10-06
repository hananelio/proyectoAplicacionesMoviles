import { TestBed } from '@angular/core/testing';

import { Autentication } from './autentication';

describe('Autentication', () => {
  let service: Autentication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Autentication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
