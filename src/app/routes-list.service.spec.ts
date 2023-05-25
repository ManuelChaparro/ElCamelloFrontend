import { TestBed } from '@angular/core/testing';

import { RoutesListService } from './routes-list.service';

describe('RoutesListService', () => {
  let service: RoutesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
