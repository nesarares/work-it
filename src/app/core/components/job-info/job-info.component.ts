import { Component, OnInit, Input } from '@angular/core';
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
  firstTabActive: boolean;
  secondTabActive: boolean;

  constructor(private jobService: JobService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      // get job's id
      const jobId = this.route.snapshot.paramMap.get('id');
      this.jobService.getJobById(jobId).subscribe(jobPromise => {
        jobPromise.then(job => {
          this.job = job;
        });
      });
      this.firstTabActive = true;
      this.secondTabActive = false;
    });
  }

  changeTab(tagName: string) {
    switch (tagName) {
      case 'first': {
        this.firstTabActive = true;
        this.secondTabActive = false;
        break;
      }
      case 'second': {
        this.secondTabActive = true;
        this.firstTabActive = false;
        break;
      }
    }
  }
}
