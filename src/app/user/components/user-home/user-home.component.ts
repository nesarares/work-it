import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { JobService } from 'src/app/shared/services/job.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { Job } from 'src/app/shared/models/job';
import { UserType } from 'src/app/shared/models/userType';
import { UserService } from 'src/app/shared/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { flatten, toOneDecimal } from 'src/app/shared/utils/utils';
import { Application } from 'src/app/shared/models/application';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.less']
})
export class UserHomeComponent implements OnInit, OnDestroy {
  employeeUserType: number = UserType.Employee.valueOf();

  user: User;
  jobs: Job[];

  stats = {
    pendingApplications: null,
    acceptedApplications: null,
    rating: null,
    averageApplicationsPerJob: null
  };

  doughnutChartLabels: string[] = [
    'Pending applications',
    'Accepted applications'
  ];
  doughnutChartData: number[] = [0, 0];
  chartOptions = {
    legend: {
      labels: {
        fontSize: 18
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    aspectRatio: 1
  };

  subscriptions: Subscription[] = [];
  reviewsSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private jobService: JobService
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    this.subscriptions.push(
      this.authService.user$
        .pipe(
          switchMap(user => {
            this.user = user;
            return this.jobService.getJobsByUserInterests(user);
          })
        )
        .subscribe(jobs => {
          this.jobs = jobs;
          this.setUserStats();
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    if (this.reviewsSubscription) this.reviewsSubscription.unsubscribe();
  }

  setUserStats() {
    if (this.user.userProfile.userType === UserType.Employee) {
      this.stats.pendingApplications = this.user.applications.filter(
        app => !app.accepted
      ).length;

      this.stats.acceptedApplications = this.user.applications.filter(
        app => app.accepted
      ).length;
    } else {
      const applicationsArray = this.jobs
        .filter(job => job.applications)
        .map(job => job.applications);
      const applications: Application[] = flatten(applicationsArray);
      console.log(applications);

      this.stats.pendingApplications =
        applications.filter(app => !app.accepted).length || 0;

      this.stats.acceptedApplications =
        applications.filter(app => app.accepted).length || 0;

      if (applicationsArray.length > 0) {
        this.stats.averageApplicationsPerJob = toOneDecimal(
          applicationsArray
            .map(app => app.length)
            .reduce((prev, curr) => prev + curr) / applicationsArray.length
        );
      } else {
        this.stats.averageApplicationsPerJob = 0;
      }

      this.doughnutChartData = [
        this.stats.pendingApplications,
        this.stats.acceptedApplications
      ];

      if (this.doughnutChartData[0] === 0 || this.doughnutChartData[1] === 0)
        this.doughnutChartData = null;
    }

    if (this.reviewsSubscription) this.reviewsSubscription.unsubscribe();
    this.reviewsSubscription = this.userService
      .getUserReviews(this.user.uid)
      .subscribe(reviews => {
        this.stats.rating = this.userService.getUserAverageReview(reviews);
        this.spinnerService.hide();
      });
  }
}
