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
    public dialogRef: MatDialogRef<JobApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Job
  ) {}

  ngOnInit() {}

  apply() {
    const user: User = this.authService.user;
    const date: Date = new Date();
    this.jobService.addJobApplication(this.data, user, date, this.message);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
