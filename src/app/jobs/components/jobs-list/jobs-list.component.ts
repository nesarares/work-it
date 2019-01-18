import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Job } from 'src/app/shared/models/job';
import { JobService } from 'src/app/shared/services/job.service';
import { stripHtmlToText } from 'src/app/shared/utils/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.less']
})
export class JobsListComponent implements OnInit, OnDestroy {
  jobList: Job[];
  mappedTags: Map<string, string> = new Map();

  filters = {
    title: null,
    tags: null,
    city: null,
    employer: null
  };

  subscriptions: Subscription[] = [];

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();

    this.subscriptions.push(
      this.route.queryParamMap.subscribe(queryParamMap => {
        this.filters.title = queryParamMap.get('title') || null;
        this.filters.employer = queryParamMap.get('employer') || null;

        const queryTags = queryParamMap.get('tags');
        this.filters.tags = queryTags ? queryTags.split(',') : null;
        this.filters.city = queryParamMap.get('city') || null;

        this.subscriptions.push(
          this.jobService.getJobsFiltered(this.filters).subscribe(jobs => {
            this.jobList = jobs;
            this.spinner.hide();
          })
        );
      })
    );

    this.subscriptions.push(
      this.jobService.getMappedTags().subscribe(mappedTags => {
        this.mappedTags = mappedTags;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Called when a card is clicked by an user.
   * Then, the user is redirected to the job information component
   * @param jobId: string, id of the job displayed on card.
   */
  cardClicked(jobId: string) {
    this.router.navigate(['/jobs', jobId]);
  }

  /**
   * Gets a color for the current tag
   * @param tag: string, the given tag
   */
  getColor(tag: string) {
    return this.mappedTags.get(tag);
  }

  /**
   * Converts html code to string
   * @param html: string, the given html that needs to be converted
   */
  convertToText(html: string) {
    return stripHtmlToText(html);
  }
}
