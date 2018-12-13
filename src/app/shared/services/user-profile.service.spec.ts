import { TestBed } from '@angular/core/testing';

import { UserProfileService } from './user-profile.service';

describe('CreateProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserProfileService = TestBed.get(UserProfileService);
    expect(service).toBeTruthy();
  });
});
