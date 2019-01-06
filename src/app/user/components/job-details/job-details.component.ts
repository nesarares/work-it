import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Job } from 'src/app/shared/models/job';
import { take } from 'rxjs/operators';
import { JobService } from 'src/app/shared/services/job.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BadgeGroupComponent } from 'src/app/shared/components/badge-group/badge-group.component';
import { LookupFn } from 'ng2-semantic-ui';
import { CitiesService } from 'src/app/shared/services/cities.service';

interface IOption {
  label: string;
  value: string;
}

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
    city: null,
    tags: [],
    period: '',
    salary: '',
    applications: [],
    publishedDate: null
  };

  userId: string;

  @ViewChild(BadgeGroupComponent)
  tagGroupComponent: BadgeGroupComponent;

  constructor(
    private auth: AuthService,
    private jobService: JobService,
    private messageService: MessageService,
    private citiesService: CitiesService
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
    if (
      !this.job.title ||
      !this.job.description ||
      !this.job.city ||
      !this.job.period ||
      !this.job.requirements
    ) {
      this.messageService.showMessage({
        type: 'error',
        text: 'Please complete all the required fields.',
        header: 'Error'
      });
      return;
    }

    this.job.tags = this.tagGroupComponent.tagList;
    this.job.publishedDate = new Date();
    this.jobService.addJob(this.job, this.userId);

    this.messageService.showMessage({
      type: 'success',
      text: 'The job listing has been added succesfully.',
      header: 'Success'
    });
  }

  // Lookup function structure:
  optionsLookupCity: LookupFn<IOption, number> = (query: string, initial?) => {
    return this.citiesService.getByTerm(query).then(results => {
      const res = results.map(city => ({ label: city, value: city }));
      return res;
    });
  };
}
