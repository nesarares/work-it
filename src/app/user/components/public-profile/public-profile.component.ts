import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/shared/models/userType';
import { Review } from 'src/app/shared/models/review';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material';
import { AddReviewComponent } from '../add-review/add-review.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.less']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  user: User;
  subscriptions: Subscription[] = [];
  employeeUserType: number = UserType.Employee.valueOf();
  review: Review = {
    stars: 0,
    message: ''
  };
  averageReview: number;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    const uid = this.route.snapshot.paramMap.get('id');
    this.subscriptions.push(
      this.userService.getUser(uid).subscribe(user => {
        this.user = user;
        if (!isNullOrUndefined(user))
          this.review.user = {
            displayName: user.displayName,
            photoUrl: user.photoUrl
          };
        console.log({ user });
        this.spinnerService.hide();
      })
    );
    this.subscriptions.push(
      this.authService.userRef().subscribe(userRef => {
        if (!isNullOrUndefined(userRef)) this.review.userRef = userRef;
      })
    );
    this.subscriptions.push(
      this.userService.getUserReviews(this.user.uid).subscribe(reviews => {
        this.averageReview = this.userService
          .getUserAverageReview(reviews)
          .valueOf();
      })
    );
  }

  addReview() {
    this.review.date = new Date();
    this.review.stars = this.averageReview;
    this.dialog.open(AddReviewComponent, {
      width: '500px',
      maxWidth: '93%',
      data: this.review
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
