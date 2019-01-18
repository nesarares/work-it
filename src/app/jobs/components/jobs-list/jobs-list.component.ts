import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.less']
})
export class JobsListComponent implements OnInit, OnDestroy {
  jobList: Job[];
  mappedTags: Map<string, string> = new Map();

  filters = {
    title: null,
    tags: null,
    city: null,
    employer: null
  };

  subscriptions: Subscription[] = [];

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();

    this.subscriptions.push(
      this.route.queryParamMap.subscribe(queryParamMap => {
        this.filters.title = queryParamMap.get('title') || null;
        this.filters.employer = queryParamMap.get('employer') || null;

        const queryTags = queryParamMap.get('tags');
        this.filters.tags = queryTags ? queryTags.split(',') : null;
        this.filters.city = queryParamMap.get('city') || null;

        this.subscriptions.push(
          this.jobService.getJobsFiltered(this.filters).subscribe(jobs => {
            this.jobList = jobs;
            this.spinner.hide();
          })
        );
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

  // onScrollDown() {
  //   // get the last displayed data on the screen
  //   this.queryParam.startingAt = this.jobList[
  //     this.jobList.length - 1
  //   ].publishedDate;

  //   this.queryParam.old = this.jobList;

  //   this.jobService
  //     .getJobsFilteredByQueryParam(this.queryParam, this.filters)
  //     .subscribe(jobs => {
  //       this.jobList = jobs;
  //     });
  // }
}
