import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { BadgeGroupComponent } from 'src/app/shared/components/badge-group/badge-group.component';
import { User } from 'src/app/shared/models/user';
import { UserProfile } from 'src/app/shared/models/userProfile';
import { UserType } from 'src/app/shared/models/userType';
import { UserProfileService } from 'src/app/shared/services/user-profile.service';

@Component({
  selector: 'app-create-profile-employee',
  templateUrl: './create-profile-employee.component.html',
  styleUrls: ['./create-profile-employee.component.less']
})
export class CreateProfileEmployeeComponent implements OnInit, OnChanges {
  userId: string;
  userProfileForm: FormGroup;
  isFormSubmitted: boolean;

  @Input()
  user: User;

  @Output()
  afterUpdate: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(BadgeGroupComponent)
  tagsGroupComponent: BadgeGroupComponent;

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

    let interests = '';
    let firstName = '';
    let lastName = '';
    let birthDate: any = '';
    let phone = '';
    let workExperience = '';
    let educationalExperience = '';
    if (this.user) {
      this.userId = this.user.uid;
      firstName = this.user.userProfile.firstName || '';
      lastName = this.user.userProfile.lastName || '';
      phone = this.user.userProfile.phone || '';
      birthDate = this.user.userProfile.birthDate || '';
      workExperience = this.user.userProfile.workExperience || '';
      educationalExperience = this.user.userProfile.educationalExperience || '';
      if (this.user.userProfile.tags) {
        interests = this.user.userProfile.tags.join(', ');
      }
    }

    this.isFormSubmitted = false;
    this.userProfileForm = this.formBuilder.group({
      firstName: [firstName, [Validators.required]],
      lastName: [lastName, [Validators.required]],
      birthDate: [birthDate, Validators.required],
      phone: [phone, Validators.maxLength(15)],
      interests: [interests, Validators.maxLength(250)],
      workExperience: [workExperience, Validators.maxLength(250)],
      educationalExperience: [educationalExperience, Validators.maxLength(250)]
    });
  }

  ngOnChanges() {}

  onSubmit() {
    let userProfile: UserProfile;
    this.isFormSubmitted = true;
    if (this.userProfileForm.status === 'VALID') {
      userProfile = {
        userType: UserType.Employee,
        firstName: this.userProfileForm.controls.firstName.value,
        lastName: this.userProfileForm.controls.lastName.value,
        birthDate: this.userProfileForm.controls.birthDate.value,
        phone: this.userProfileForm.controls.phone.value,
        workExperience: this.userProfileForm.controls.workExperience.value,
        educationalExperience: this.userProfileForm.controls
          .educationalExperience.value,
        tags: this.tagsGroupComponent.tagList
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
          console.log('Profile creation failed.');
          if (this.user) {
            this.afterUpdate.emit(false);
          } else {
            this.router.navigate([`/user/${this.userId}/create-profile`]);
          }
        });
    }
  }
}
