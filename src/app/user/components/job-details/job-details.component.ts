import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Job } from 'src/app/shared/models/job';
import { take } from 'rxjs/operators';
import { JobService } from 'src/app/shared/services/job.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BadgeGroupComponent } from 'src/app/shared/components/badge-group/badge-group.component';
import { LookupFn } from 'ng2-semantic-ui';
import { CitiesService } from 'src/app/shared/services/cities.service';
import { ActivatedRoute } from '@angular/router';
import { names } from 'src/app/shared/constants/names';

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
  buttonText: string;

  @ViewChild(BadgeGroupComponent)
  tagGroupComponent: BadgeGroupComponent;

  constructor(
    private auth: AuthService,
    private jobService: JobService,
    private messageService: MessageService,
    private citiesService: CitiesService,
    private activatedRoute: ActivatedRoute
  ) {}

  /*
   * If jobId is present in route job will be edited, and fields will be populated with coresponding values from the job.
   * Otherwise will be added.
   */
  ngOnInit() {
    const user = this.auth.user;
    this.job.employer = {
      displayName: user.displayName,
      photoUrl: user.photoUrl
    };
    this.userId = user.uid;

    this.activatedRoute.paramMap.subscribe(obs => {
      const jobId = obs.get('jobId');

      this.buttonText = names.buttonAddJob;

      // the job will be added
      if (!jobId) {
        return;
      }

      this.buttonText = names.buttonEditJob;

      // the job will be edited
      this.populateFields(jobId);
    });
  }

  /**
   * Populates fields with values coresponding to the job with id @param jobId
   * @param jobId: string, job's id
   */
  private populateFields(jobId: string) {
    this.jobService.getJobById(jobId).subscribe(job => {
      this.job = job;
      this.tags = this.job.tags.join(',');
    });
  }

  /**
   * Handles add job action.
   * A new job will be added into database, if all requirements are satisfied
   * A message will be displayed based on that.
   */
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

    let message = 'The job has been succesfully added .';
    this.job.tags = this.tagGroupComponent.tagList;

    if (this.buttonText === names.buttonAddJob) {
      this.job.publishedDate = new Date();
      this.jobService.addJob(this.job, this.userId);
    } else {
      this.jobService.updateJob(this.job);
      message = 'The job has been succesfully updated .';
    }

    this.messageService.showMessage({
      type: 'success',
      text: message,
      header: 'Success'
    });
  }

  /**
   * Handles job filtering by city action
   */
  optionsLookupCity: LookupFn<IOption, number> = (query: string, initial?) => {
    return this.citiesService.getByTerm(query).then(results => {
      const res = results.map(city => ({ label: city, value: city }));
      return res;
    });
  };
}
