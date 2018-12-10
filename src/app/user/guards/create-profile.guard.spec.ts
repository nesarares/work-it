import { TestBed, async, inject } from '@angular/core/testing';

import { CreateProfileGuard } from './create-profile.guard';

describe('CreateProfileGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateProfileGuard]
    });
  });

  it('should ...', inject([CreateProfileGuard], (guard: CreateProfileGuard) => {
    expect(guard).toBeTruthy();
  }));
});
