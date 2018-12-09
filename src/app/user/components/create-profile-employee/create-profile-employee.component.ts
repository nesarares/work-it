import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/shared/services/user-profile.service';
import { UserType } from 'src/app/shared/models/userType';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/userProfile';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-profile-employee',
  templateUrl: './create-profile-employee.component.html',
  styleUrls: ['./create-profile-employee.component.less']
})
export class CreateProfileEmployeeComponent implements OnInit {
  userId: string;
  userProfileForm: FormGroup;
  isFormSubmitted: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private createProfileService: UserProfileService
  ) {}

  onSubmit() {
    let userProfile: UserProfile;
    this.isFormSubmitted = true;
    if (this.userProfileForm.status === 'VALID') {
      userProfile = {
        userType: UserType.Employer,
        firstName: this.userProfileForm.controls.firstName.value,
        lastName: this.userProfileForm.controls.lastName.value,
        birthDate: this.userProfileForm.controls.birthDate.value,
        interests: this.userProfileForm.controls.interests.value,
        workExperience: this.userProfileForm.controls.workExperience.value,
        educationalExperience: this.userProfileForm.controls
          .educationalExperience.value
      };
      this.createProfileService
        .updateUserProfile(this.userId, userProfile)
        .then(res => this.router.navigate([`/user/${this.userId}`]))
        .catch(fail => {
          console.log('Profile creation failed.');
          this.router.navigate([`/user/${this.userId}/create-profile`]);
        });
    }
  }

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.userId = params['id'];
    });

    this.isFormSubmitted = false;
    this.userProfileForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', Validators.required],
      interests: ['', Validators.maxLength(250)],
      workExperience: ['', Validators.maxLength(250)],
      educationalExperience: ['', Validators.maxLength(250)]
    });
  }
}
