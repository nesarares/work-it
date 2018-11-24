import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Job } from 'src/app/shared/models/job';
import { AngularFirestore } from '@angular/fire/firestore';
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
    employerID: '',
    title: '',
    description: '',
    requirements: '',
    tags: [],
    period: '',
    salary: ''
  };

  constructor(private auth: AuthService, private jobService: JobService) {}

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      this.job.employerID = user.uid;
    });
  }

  addJob() {
    this.job.tags = this.tags.split(',').map(tag => tag.trim());
    this.jobService.addJob(this.job);
  }
}
