import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Job } from 'src/app/shared/models/job';
import { AuthService } from 'src/app/shared/services/auth.service';
import { JobService } from 'src/app/shared/services/job.service';
import { stripHtmlToText } from 'src/app/shared/utils/utils';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-jobs',
  templateUrl: './user-jobs.component.html',
  styleUrls: ['./user-jobs.component.less']
})
export class UserJobsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  jobs$: Observable<Job[]>;
  userId: string;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.authService
      .userRef()
      .pipe(take(1))
      .subscribe(userRef => {
        this.userId = userRef.id;
        this.jobs$ = this.jobService.getJobsByEmployer(userRef).pipe(
          tap(() => {
            this.spinner.hide();
          })
        );
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  convertToText(html: string) {
    return stripHtmlToText(html);
  }

  onEdit(jobId: string) {
    this.router.navigate([
      `user/${this.userId}`,
      { outlets: { dashboard: ['job', jobId] } }
    ]);
  }
}
