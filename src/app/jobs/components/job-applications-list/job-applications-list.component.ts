import { Component, OnInit, Input } from '@angular/core';
import { Job } from 'src/app/shared/models/job';
import { Application } from 'src/app/shared/models/application';
import { JobService } from 'src/app/shared/services/job.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/shared/services/user.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-job-applications-list',
  templateUrl: './job-applications-list.component.html',
  styleUrls: ['./job-applications-list.component.less']
})
export class JobApplicationsListComponent implements OnInit {
  @Input()
  job: Job;

  applicationList: Application[] = [];
  acceptedUsers: Map<string, User> = new Map();

  constructor(
    public userService: UserService,
    private jobService: JobService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnChanges() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  /**
   * Used to load job applications data from database
   */
  loadData() {
    this.applicationList = this.job.applications;
    if (!this.applicationList) return;
    this.applicationList
      .filter(application => application.accepted)
      .forEach(application => {
        application.employeeRef.get().then(user => {
          this.acceptedUsers[application.employeeRef.id] = user.data();
        });
      });
  }

  /**
   * Accepts an employee based on user id
   * @param userId: string, the id on the user
   */
  async acceptEmployee(userId: string) {
    this.spinner.show();
    try {
      await this.jobService.acceptApplication(userId, this.job);
    } finally {
      this.spinner.hide();
    }
  }
}
