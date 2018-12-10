import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfileEmployeeComponent } from './create-profile-employee.component';

describe('CreateProfileEmployeeComponent', () => {
  let component: CreateProfileEmployeeComponent;
  let fixture: ComponentFixture<CreateProfileEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProfileEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
