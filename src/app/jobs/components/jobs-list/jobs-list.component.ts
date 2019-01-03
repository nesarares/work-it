import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';
import { stripHtmlToText } from 'src/app/shared/utils/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.less']
})
export class JobsListComponent implements OnInit, OnDestroy {
  jobList: Job[];
  throttle = 1000;
  scrollDistance = 1;
  jobsPerScroll = 4;
  mappedTags: Map<string, string> = new Map();

  subscriptions: Subscription[] = [];

  constructor(
    private jobService: JobService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.subscriptions.push(
      this.jobService.getJobsByQueryParam(this.queryParam).subscribe(jobs => {
        this.jobList = jobs;
        this.spinner.hide();
      })
    );

    this.subscriptions.push(
      this.jobService.getMappedTags().subscribe(mappedTags => {
        this.mappedTags = mappedTags;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onScrollDown() {
    // get the last displayed data on the screen
    this.queryParam.startingAt = this.jobList[
      this.jobList.length - 1
    ].publishedDate;

    this.queryParam.old = this.jobList;

    this.jobService.getJobsByQueryParam(this.queryParam).subscribe(jobs => {
      this.jobList = jobs;
    });
  }

  cardClicked(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }

  getColor(tag: string) {
    return this.mappedTags.get(tag);
  }

  convertToText(html: string) {
    return stripHtmlToText(html);
  }

  private queryParam = {
    orderBy: 'publishedDate',
    limitTo: this.jobsPerScroll,
    startingAt: undefined,
    old: []
  };
}
