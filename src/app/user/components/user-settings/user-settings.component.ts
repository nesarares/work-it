import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/shared/services/user-profile.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { UserType } from 'src/app/shared/models/userType';
import { take } from 'rxjs/operators';
import { imageConstants } from 'src/app/shared/constants/image-constants';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.less']
})
export class UserSettingsComponent implements OnInit {
  employerType: UserType = UserType.Employer;
  employeeType: UserType = UserType.Employee;

  user: User;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.user = this.authService.user;

    if (!this.user) {
      this.authService.user$.pipe(take(1)).subscribe(user => {
        console.log({ user });
        this.user = user;
        this.spinner.hide();
      });
    } else {
      this.spinner.hide();
    }
  }

  updateCallback(success: boolean) {
    if (success) {
      this.messageService.showMessage({
        type: 'success',
        text: 'The profile was updated succesfully!',
        header: 'Success'
      });
    } else {
      this.messageService.showMessage({
        type: 'error',
        text:
          'There was a problem with profile update. Please try again later.',
        header: 'Error'
      });
    }
  }

  uploadPhoto(event) {
    const file = event.target.files[0];
    const { size } = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = evt => {
      const img = new Image();
      img.src = (evt.target as any).result;
      img.onload = () => {
        const { width, height } = img;
        console.log({ width, height, size });
        if (this.checkValidImage(size, width, height)) {
          // upload image
        } else {
          // invalid image
          console.log(
            'Image must be a square, with at least 240px size and less than 300kb'
          );
        }
      };
    };
  }

  checkValidImage(size: number, width: number, height: number): boolean {
    return (
      size < imageConstants.maxSizeBytes &&
      width === height &&
      width >= imageConstants.minSizePx
    );
  }
}
