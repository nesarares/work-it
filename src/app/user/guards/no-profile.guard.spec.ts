import { TestBed, async, inject } from '@angular/core/testing';

import { NoProfileGuard } from './no-profile.guard';

describe('NoProfileGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoProfileGuard]
    });
  });

  it('should ...', inject([NoProfileGuard], (guard: NoProfileGuard) => {
    expect(guard).toBeTruthy();
  }));
});
