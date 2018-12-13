import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSimilarComponent } from './job-similar.component';

describe('JobSimilarComponent', () => {
  let component: JobSimilarComponent;
  let fixture: ComponentFixture<JobSimilarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSimilarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSimilarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
