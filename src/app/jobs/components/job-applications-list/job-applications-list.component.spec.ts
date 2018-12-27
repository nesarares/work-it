import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationsListComponent } from './job-applications-list.component';

describe('JobApplicationsListComponent', () => {
  let component: JobApplicationsListComponent;
  let fixture: ComponentFixture<JobApplicationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplicationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
