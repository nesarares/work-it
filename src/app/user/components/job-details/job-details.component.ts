import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Job } from 'src/app/shared/models/job';
import { take } from 'rxjs/operators';
import { JobService } from 'src/app/shared/services/job.service';
import { MessageService } from 'src/app/shared/services/message.service';

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
    applications: [],
    publishedDate: null
  };

  userId: string;

  constructor(
    private auth: AuthService,
    private jobService: JobService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const user = this.auth.user;
    this.job.employer = {
      displayName: user.userProfile.companyName
        ? user.userProfile.companyName
        : user.displayName,
      photoUrl: user.photoUrl
    };
    this.userId = user.uid;
  }

  addJob() {
    this.job.tags = this.tags.split(',').map(tag => tag.trim());
    this.job.publishedDate = new Date();
    this.jobService.addJob(this.job, this.userId);

    this.messageService.showMessage({
      type: 'success',
      text: 'The job listing has been added succesfully.',
      header: 'Success'
    });
  }
}
