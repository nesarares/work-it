import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from 'src/app/shared/services/job.service';
import { Job } from 'src/app/shared/models/job';
import { } from 'ng2-semantic-ui';
import { Router } from '@angular/router';


@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.less']
})
export class JobsListComponent implements OnInit {
  
  jobList: Job[];
  displayedList: Job[];

  throttle = 300;
  scrollDistance = 5;
  scrollUpDistance = 5;
  
  start = 5;


  constructor(private jobService: JobService, private router: Router) {

      // update on refresh / navigation
      // this.jobService.getJobs().subscribe(jobs=>{
      //   this.jobList = jobs;
      // });

      // Real time update
      this.jobService.getObservaleJobs().subscribe(()=>{
        this.jobService.getJobs().subscribe(jobs => {
            this.jobList = jobs;
          });
      });

  }

  ngOnInit() {
  }


  onScrollDown() {
  }

  onUp(){
  }

  cardClicked(jobId: string){
    this.router.navigate([`/job-info`, jobId]);
  }
}
