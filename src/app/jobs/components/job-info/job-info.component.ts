import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user';
import { MatDialog } from '@angular/material/dialog';
import { JobApplicationComponent } from '../job-application/job-application.component';

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.less']
})
export class JobInfoComponent implements OnInit {
  job: Job;
  showModal: boolean = false;
  applyDisabled: boolean = false;
  isUserTitularOfTheJob: boolean = false;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      // get job's id
      const jobId = this.route.snapshot.paramMap.get('id');
      this.jobService.getJobById(jobId).subscribe(async job => {
        this.job = job;
        const userRef = await this.authService.userRef();

        this.applyDisabled = job.applications
          ? !!job.applications.find(
              application => application.employeeRef === userRef
            )
          : false;
        this.isUserTitularOfTheJob =
          this.job.employerRef.id === this.authService.user.uid;
      });
    });
  }

  handleApply() {
    this.dialog.open(JobApplicationComponent, {
      width: '500px',
      maxWidth: '93%',
      data: this.job
    });
  }
}
