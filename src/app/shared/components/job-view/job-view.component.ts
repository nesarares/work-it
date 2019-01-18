import { Component, OnInit, Input, Output } from '@angular/core';
import { Job } from '../../models/job';
import { Router } from '@angular/router';
import { cssConstants } from '../../constants/css-constants';
import { stripHtmlToText } from '../../utils/utils';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.less']
})
export class JobViewComponent implements OnInit {
  @Input()
  job: Job;

  @Input()
  mappedTags: Map<string, string>;

  constructor(private router: Router) {}

  ngOnInit() {}

  /**
   * Called when a card is clicked by an user.
   * Then, the user is redirected to the job information component
   * @param jobId: string, id of the job displayed on card.
   */
  cardClicked(jobId: string) {
    this.router.navigateByUrl(jobId);
  }

  /**
   * Gets a color for the current tag
   * @param tag: string, the given tag
   */
  getColor(tag: string) {
    if (this.mappedTags) return this.mappedTags.get(tag);
    return cssConstants.secondaryColor;
  }

  /**
   * Converts html code to string
   * @param html: string, the given html that needs to be converted
   */
  convertToText(html: string) {
    return stripHtmlToText(html);
  }
}
