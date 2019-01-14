import { Component, OnInit, OnDestroy } from '@angular/core';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user';
import { MatDialog } from '@angular/material/dialog';
import { JobApplicationComponent } from '../job-application/job-application.component';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { take } from 'rxjs/operators';
import { UserType } from 'src/app/shared/models/userType';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.less']
})
export class JobInfoComponent implements OnInit, OnDestroy {
  job: Job;
  showModal: boolean = false;
  applyDisabled: boolean = false;
  isEmployer: boolean = false;
  isUserTitularOfTheJob: boolean = false;
  subscriptions: Subscription[] = [];
  loggedUser: boolean = true;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.subscriptions.push(
      this.route.paramMap.subscribe(() => {
        // get job's id
        const jobId = this.route.snapshot.paramMap.get('id');
        this.subscriptions.push(
          this.jobService.getJobById(jobId).subscribe(job => {
            this.job = job;
            this.subscriptions.push(
              this.authService.userRef().subscribe(userRef => {
                this.loggedUser = !!userRef;
                if (
                  this.authService.user &&
                  this.authService.user.userProfile.userType ===
                    UserType.Employer
                ) {
                  this.isUserTitularOfTheJob =
                    this.job.employerRef.id === this.authService.user.uid;
                  this.isEmployer = true;
                } else {
                  if (userRef) {
                    this.applyDisabled = job.applications
                      ? !!job.applications.find(
                          application =>
                            application.employeeRef.id === userRef.id
                        )
                      : false;
                    this.isEmployer = false;
                  }
                }
                this.spinner.hide();
              })
            );
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  handleApply() {
    if (!this.loggedUser) {
      this.messageService.showMessage({
        type: 'error',
        text: 'You need to be logged in order to apply for a job.',
        header: 'Error'
      });
      return;
    }

    this.dialog.open(JobApplicationComponent, {
      width: '500px',
      maxWidth: '93%',
      data: this.job
    });
  }
}
