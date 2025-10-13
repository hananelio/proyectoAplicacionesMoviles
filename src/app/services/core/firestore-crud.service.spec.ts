import { TestBed } from '@angular/core/testing';

import { FirestoreCrudService } from './firestore-crud.service';

describe('FirebaseCrudService', () => {
  let service: FirestoreCrudService <any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
