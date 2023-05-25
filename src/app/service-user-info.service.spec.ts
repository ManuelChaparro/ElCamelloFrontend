import { TestBed } from '@angular/core/testing';

import { ServiceUserInfoService } from './service-user-info.service';

describe('ServiceUserInfoService', () => {
  let service: ServiceUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceUserInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
