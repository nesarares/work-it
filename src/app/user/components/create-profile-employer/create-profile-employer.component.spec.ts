import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfileEmployerComponent } from './create-profile-employer.component';

describe('CreateProfileEmployerComponent', () => {
  let component: CreateProfileEmployerComponent;
  let fixture: ComponentFixture<CreateProfileEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProfileEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
