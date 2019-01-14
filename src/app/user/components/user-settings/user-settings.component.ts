import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/shared/services/user-profile.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/app/shared/models/user';
import { Subscription, Observable } from 'rxjs';
import { UserType } from 'src/app/shared/models/userType';
import { take, finalize, tap } from 'rxjs/operators';
import { fileConstants } from 'src/app/shared/constants/image-constants';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.less']
})
export class UserSettingsComponent implements OnInit {
  employerType: UserType = UserType.Employer;
  employeeType: UserType = UserType.Employee;

  user: User;
  user$: Observable<User>;

  imageError: boolean = false;
  cvError: boolean = false;
  uploadPercentImage: Observable<number>;
  uploadPercentCv: Observable<number>;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private userService: UserService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.user = this.authService.user;
    if (!this.user) {
      this.user$ = this.authService.user$.pipe(
        tap(user => {
          this.spinner.hide();
          this.user = user;
          this.uploadPercentImage = null;
        })
      );
    } else {
      this.user$ = this.userService.getUser(this.user.uid).pipe(
        tap(() => {
          this.spinner.hide();
          // this.uploadPercentImage = null;
        })
      );
    }
  }

  async deleteCv(userId: string) {
    this.spinner.show();
    await this.userProfileService.deleteUserCv(userId).toPromise();
    this.spinner.hide();
    this.messageService.showMessage({
      type: 'success',
      text: 'The cv has been removed succesfully.',
      header: 'Success'
    });
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
    const file: File = event.target.files[0];
    if (!file) return;
    const { size, type } = file;

    if (!this.checkValidImageSizeAndFormat(size, type)) {
      this.imageError = true;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = evt => {
      const img = new Image();
      img.src = (evt.target as any).result;
      img.onload = () => {
        const { width, height } = img;
        console.log({ width, height, size });
        if (this.checkValidImage(width, height)) {
          // upload image
          this.imageError = false;
          const task = this.userProfileService.updateUserPhoto(
            this.user.uid,
            file
          );
          this.uploadPercentImage = task.percentageChanges();
          task.then(() => {
            this.uploadPercentImage = null;
            this.messageService.showMessage({
              type: 'success',
              text: 'The profile picture has been updated succesfully.',
              header: 'Success'
            });
          });
        } else {
          // invalid image
          this.imageError = true;
        }
      };
    };
  }

  checkValidImage(width: number, height: number): boolean {
    return width === height && width >= fileConstants.avatarMinSizePx;
  }

  checkValidImageSizeAndFormat(size: number, format: string) {
    return (
      size < fileConstants.avatarMaxSizeBytes &&
      fileConstants.avatarFileTypes.includes(format)
    );
  }

  uploadCv(event) {
    const file: File = event.target.files[0];
    if (!file) return;
    const { size, type } = file;

    if (!this.checkValidCvSizeAndFormat(size, type)) {
      this.cvError = true;
      return;
    }
    this.cvError = false;
    const task = this.userProfileService.updateUserCv(this.user.uid, file);
    this.uploadPercentCv = task.percentageChanges();
    task.then(() => {
      this.uploadPercentCv = null;
      this.messageService.showMessage({
        type: 'success',
        text: 'The cv has been uploaded succesfully.',
        header: 'Success'
      });
    });
  }

  checkValidCvSizeAndFormat(size: number, format: string) {
    return (
      size < fileConstants.cvMaxSizeBytes && format === fileConstants.cvFileType
    );
  }
}
