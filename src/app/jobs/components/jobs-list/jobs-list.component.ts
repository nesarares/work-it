import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/shared/services/job.service';
import { Job } from 'src/app/shared/models/job';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.less']
})
export class JobsListComponent implements OnInit {
  jobList: Job[];
  throttle = 1000;
  scrollDistance = 8;
  mappedTags: Map<string, string> = new Map();

  constructor(private jobService: JobService, private router: Router) {
    // Real time update
    this.jobService.getObservaleJobs().subscribe(() => {
      this.jobService.getJobs(this.queryParam).subscribe(jobs => {
        this.jobList = jobs;
      });
      this.mappedTags = this.jobService.getMappedTags();
    });
  }

  ngOnInit() {}

  onScrollDown() {
    console.log(this.mappedTags);
    this.queryParam.startingAt = this.jobList[this.jobList.length - 1].id;
    this.queryParam.old = this.jobList;
    this.jobService.getJobs(this.queryParam).subscribe(jobs => {
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
    limitTo: this.scrollDistance,
    startingAt: undefined,
    old: []
  };
}
