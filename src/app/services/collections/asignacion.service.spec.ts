import { TestBed } from '@angular/core/testing';

import { AsignaciónService } from './asignación.service';

describe('AsignaciónService', () => {
  let service: AsignaciónService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignaciónService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
