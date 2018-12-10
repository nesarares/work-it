import { Component, OnInit, Input } from '@angular/core';
import { Job } from 'src/app/shared/models/job';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.less']
})
export class JobDescriptionComponent implements OnInit {
  @Input()
  job: Job;

  constructor() {}

  ngOnInit() {}
}
