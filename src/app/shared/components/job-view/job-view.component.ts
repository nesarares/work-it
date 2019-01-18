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

  cardClicked(jobId: string) {
    this.router.navigateByUrl(jobId);
  }

  getColor(tag: string) {
    if (this.mappedTags) return this.mappedTags.get(tag);
    return cssConstants.secondaryColor;
  }

  convertToText(html: string) {
    return stripHtmlToText(html);
  }
}
