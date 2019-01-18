import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserProfileService } from 'src/app/shared/services/user-profile.service';
import { UserType } from 'src/app/shared/models/userType';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/userProfile';
import { take } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-create-profile-employer',
  templateUrl: './create-profile-employer.component.html',
  styleUrls: ['./create-profile-employer.component.less']
})
export class CreateProfileEmployerComponent implements OnInit {
  userId: string;
  userProfileForm: FormGroup;
  isFormSubmitted: boolean;

  @Input()
  user: User;

  @Output()
  afterUpdate: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private createProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.userId = params['id'];
    });

    let firstName = '';
    let lastName = '';
    let birthDate: any = '';
    let aboutCompany = '';
    // let companyName = '';
    if (this.user) {
      this.userId = this.user.uid;
      firstName = this.user.userProfile.firstName || '';
      lastName = this.user.userProfile.lastName || '';
      birthDate = this.user.userProfile.birthDate || '';
      aboutCompany = this.user.userProfile.aboutCompany || '';
      // companyName = this.user.userProfile.companyName || '';
    }

    this.isFormSubmitted = false;
    this.userProfileForm = this.formBuilder.group({
      firstName: [firstName, [Validators.required]],
      lastName: [lastName, []],
      // companyName: [companyName, [Validators.required]],
      aboutCompany: [aboutCompany, [Validators.required]],
      birthDate: [birthDate, [Validators.required]]
    });
  }

  /**
   * Handles create profile action. On success, an employer user profile is associated with the logged in user`s account.
   * The user will be redirected to dashboard after the profile is created.
   */
  onSubmit() {
    let userProfile: UserProfile;
    this.isFormSubmitted = true;
    if (this.userProfileForm.status === 'VALID') {
      userProfile = {
        userType: UserType.Employer,
        firstName: this.userProfileForm.controls.firstName.value,
        lastName: this.userProfileForm.controls.lastName.value,
        birthDate: this.userProfileForm.controls.birthDate.value,
        // companyName: this.userProfileForm.controls.companyName.value,
        aboutCompany: this.userProfileForm.controls.aboutCompany.value
      };
      this.createProfileService
        .updateUserProfile(this.userId, userProfile)
        .then(() => {
          if (this.user) {
            this.afterUpdate.emit(true);
          } else {
            this.router.navigate([`/user/${this.userId}`]);
          }
        })
        .catch(() => {
          if (this.user) {
            this.afterUpdate.emit(false);
          } else {
            this.router.navigate([`/user/${this.userId}/create-profile`]);
          }
        });
    }
  }
}
