import { TestBed } from '@angular/core/testing';

import { CreateProfileService } from './create-profile.service';

describe('CreateProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateProfileService = TestBed.get(CreateProfileService);
    expect(service).toBeTruthy();
  });
});
