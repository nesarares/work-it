import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Inject
} from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';
import { User } from 'src/app/shared/models/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'src/app/shared/services/message.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.less']
})
export class JobApplicationComponent implements OnInit {
  message: string;

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<JobApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Job
  ) {}

  ngOnInit() {}

  /**
   * Handles job application event triggered by the logged in user
   */
  async apply() {
    this.spinner.show();
    const user: User = this.authService.user;
    const date: Date = new Date();
    await this.jobService.addJobApplication(
      this.data,
      user,
      date,
      this.message
    );
    this.spinner.hide();
    this.messageService.showMessage({
      type: 'success',
      text: 'The application has been added succesfully.',
      header: 'Success'
    });
    this.close();
  }

  /**
   * Closes the modal displayed on job applying
   */
  close() {
    this.dialogRef.close();
  }
}
