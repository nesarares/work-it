import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.less']
})
export class JobsListComponent implements OnInit {
  jobList: Job[];
  throttle = 1500;
  scrollDistance = 1;
  jobsPerScroll = 4;
  mappedTags: Map<string, string> = new Map();

  constructor(private jobService: JobService, private router: Router) {
    this.jobService.getJobsByQueryParam(this.queryParam).subscribe(jobs => {
      this.jobList = jobs;
    });

    this.jobService.getMappedTags().subscribe(mappedTags => {
      this.mappedTags = mappedTags;
    });
  }

  ngOnInit() {}

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

  private queryParam = {
    orderBy: 'publishedDate',
    limitTo: this.jobsPerScroll,
    startingAt: undefined,
    old: []
  };
}
