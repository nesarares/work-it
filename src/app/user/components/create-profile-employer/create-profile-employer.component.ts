import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/shared/services/user-profile.service';
import { UserType } from 'src/app/shared/models/userType';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/userProfile';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-profile-employer',
  templateUrl: './create-profile-employer.component.html',
  styleUrls: ['./create-profile-employer.component.less']
})
export class CreateProfileEmployerComponent implements OnInit {
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
        companyName: this.userProfileForm.controls.companyName.value,
        aboutCompany: this.userProfileForm.controls.aboutCompany.value
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
      companyName: ['', [Validators.required]],
      aboutCompany: ['', [Validators.required]],
      birthDate: ['', [Validators.required]]
    });
  }
}
