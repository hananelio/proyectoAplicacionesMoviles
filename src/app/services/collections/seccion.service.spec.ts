import { TestBed } from '@angular/core/testing';

import { SecciónService } from './sección.service';

describe('SecciónService', () => {
  let service: SecciónService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecciónService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
