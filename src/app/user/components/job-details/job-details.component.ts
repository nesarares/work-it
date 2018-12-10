import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Job } from 'src/app/shared/models/job';
import { take } from 'rxjs/operators';
import { JobService } from 'src/app/shared/services/job.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.less']
})
export class JobDetailsComponent implements OnInit {
  tags: string;
  job: Job = {
    id: '',
    title: '',
    description: '',
    requirements: '',
    tags: [],
    period: '',
    salary: '',
    publishedDate: null
  };

  userId: string;

  constructor(private auth: AuthService, private jobService: JobService) {}

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      this.job.employer = {
        displayName: user.displayName,
        photoUrl: user.photoUrl
      };
      this.userId = user.uid;
    });
  }

  addJob() {
    this.job.tags = this.tags.split(',').map(tag => tag.trim());
    this.job.publishedDate = new Date();
    this.jobService.addJob(this.job, this.userId);
  }
}
