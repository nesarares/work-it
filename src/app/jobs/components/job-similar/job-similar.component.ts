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

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }

  ngOnInit() {}

  handleClick(job: Job) {
    this.router.navigate(['/jobs', job.id]);
  }

  /**
   * Return a list of jobs which have at leas one common tag with the current job
   * @param jobs
   */
  private getSimilarJobs(jobs: Job[]) {
    let simJobList: Job[] = [];

    if (!this.job || !this.job.tags) {
      return;
    }

    jobs.forEach(curentJob => {
      if (!curentJob.tags) {
        return;
      }

      if (curentJob.id === this.job.id) {
        return;
      }

      curentJob.tags.forEach(tag => {
        if (
          this.job.tags.indexOf(tag) > -1 &&
          !simJobList.includes(curentJob)
        ) {
          simJobList.push(curentJob);
          return;
        }
      });
    });

    return simJobList;
  }

  /**
   * Used to load job's data from database
   */
  private loadData() {
    this.jobService.getAllJobs().subscribe(jobs => {
      this.similarJobList = this.getSimilarJobs(jobs);
    });
  }
}
