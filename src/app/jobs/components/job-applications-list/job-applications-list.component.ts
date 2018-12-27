import { Component, OnInit, Input } from '@angular/core';
import { Job } from 'src/app/shared/models/job';
import { Application } from 'src/app/shared/models/application';
import { JobService } from 'src/app/shared/services/job.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-applications-list',
  templateUrl: './job-applications-list.component.html',
  styleUrls: ['./job-applications-list.component.less']
})
export class JobApplicationsListComponent implements OnInit {
  @Input()
  job: Job;

  applicationList: Application[] = [];

  constructor(private jobService: JobService) {}

  ngOnChanges() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  /**
   * Used to load job applications' data from database
   */
  loadData() {
    // TODO: add router link to profile of the applicant?
    let jobId = this.job.id;
    this.jobService.getJobById(jobId).subscribe(job => {
      this.applicationList = job.applications;
    });
  }
}
