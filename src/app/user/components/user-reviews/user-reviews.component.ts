import { Component, OnInit, Input } from '@angular/core';
import { Review } from 'src/app/shared/models/review';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.less']
})
export class UserReviewsComponent implements OnInit {
  @Input()
  reviews: Review[];

  @Input()
  username: string;

  constructor() {}

  ngOnInit() {}
}
