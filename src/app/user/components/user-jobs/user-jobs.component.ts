import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Job } from 'src/app/shared/models/job';
import { AuthService } from 'src/app/shared/services/auth.service';
import { JobService } from 'src/app/shared/services/job.service';
import { stripHtmlToText } from 'src/app/shared/utils/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'src/app/shared/services/message.service';

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
    private messageService: MessageService,
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

  onDelete(jobId: string) {
    this.jobService.deleteJob(jobId).then(resp => {
      this.messageService.showMessage({
        header: 'Success',
        text: 'The job was deleted successfully',
        type: 'success'
      });
    });
  }

  /**
   *  Method called when enable/disable button is pressed
   * @param jobId: string, representing job's id
   * @param isActive: boolean, representing operation type
   */
  async onEnableDisable(jobId: string, willBeActive: boolean) {
    const promise = new Promise<Job>((resolve, reject) =>
      this.jobService.getJobById(jobId).subscribe(resolve, reject)
    );

    let job = await promise;
    job.isActive = willBeActive;
    this.jobService.updateJob(job);
  }
}
