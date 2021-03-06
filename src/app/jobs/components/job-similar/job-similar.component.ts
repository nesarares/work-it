import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-similar',
  templateUrl: './job-similar.component.html',
  styleUrls: ['./job-similar.component.less']
})
export class JobSimilarComponent implements OnInit {
  @Input()
  job: Job;

  similarJobList: Job[] = [];

  constructor(private jobService: JobService) {}

  ngOnChanges() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  /**
   * Return a list of jobs which have at least one common tag with the current job
   * @param jobs: Job[], A list containing all available jobs
   */
  getSimilarJobs(jobs: Job[]) {
    const simJobList: Job[] = [];

    if (!this.job || !this.job.tags) {
      return simJobList;
    }

    this.job.tags = this.job.tags.map(t => t.toLowerCase());

    for (const currentJob of jobs) {
      if (!currentJob.tags || currentJob.id === this.job.id) {
        continue;
      }

      currentJob.tags
        .map(t => t.toLowerCase())
        .forEach(tag => {
          if (this.job.tags.includes(tag) && !simJobList.includes(currentJob)) {
            simJobList.push(currentJob);
            return;
          }
        });

      if (simJobList.length === 4) break;
    }

    return simJobList;
  }

  /**
   * Used to load job's data from database
   */
  loadData() {
    this.jobService.getJobs().subscribe(jobs => {
      this.similarJobList = this.getSimilarJobs(jobs);
    });
  }
}
