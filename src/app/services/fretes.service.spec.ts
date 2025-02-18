import { TestBed } from '@angular/core/testing';

import { FretesService } from './fretes.service';

describe('FretesService', () => {
  let service: FretesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FretesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
