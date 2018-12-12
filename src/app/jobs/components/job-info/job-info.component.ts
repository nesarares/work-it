import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.less']
})
export class JobInfoComponent implements OnInit {
  job: Job;

  constructor(private jobService: JobService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      // get job's id
      const jobId = this.route.snapshot.paramMap.get('id');
      this.jobService.getJobById(jobId).subscribe(job => {
        this.job = job;
      });
    });
  }

  handleApply() {
    console.log('Apply');
  }
}
