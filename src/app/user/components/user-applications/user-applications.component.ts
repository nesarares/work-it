import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/shared/services/job.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { take, tap, map } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
import { Job } from 'src/app/shared/models/job';
import { Application } from 'src/app/shared/models/application';
import { UserService } from 'src/app/shared/services/user.service';
import { DocumentReference } from '@angular/fire/firestore';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-user-applications',
  templateUrl: './user-applications.component.html',
  styleUrls: ['./user-applications.component.less']
})
export class UserApplicationsComponent implements OnInit {
  applications$: Observable<Application[]>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    const authUser = this.authService.user;
    if (authUser) {
      this.applications$ = this.userService.getUser(authUser.uid).pipe(
        tap(user => {
          user.applications;
          this.spinner.hide();
        }),
        map(user =>
          user.applications.sort((x, y) =>
            x.accepted === y.accepted ? 0 : x.accepted ? -1 : 1
          )
        )
      );
    } else {
      this.applications$ = this.authService.user$.pipe(
        tap(user => {
          this.spinner.hide();
        }),
        map(user => user.applications)
      );
    }
  }

  /**
   * Handles the deletion of a job application
   * @param jobRef: DocumentReference, the job reference
   */
  onDelete(jobRef: DocumentReference) {
    this.userService.removeUserApplication(jobRef);
    this.messageService.showMessage({
      type: 'success',
      text: 'The application has been removed succesfully.',
      header: 'Success'
    });
  }
}
