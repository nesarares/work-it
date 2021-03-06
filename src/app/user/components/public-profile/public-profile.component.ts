import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/shared/models/userType';
import { tap } from 'rxjs/operators';
import { Review } from 'src/app/shared/models/review';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material';
import { AddReviewComponent } from '../add-review/add-review.component';
import { isNullOrUndefined } from 'util';
import { IPopup } from 'ng2-semantic-ui';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.less']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  employeeUserType: number = UserType.Employee.valueOf();

  user$: Observable<User>;
  user: User;
  loggedUser$: Observable<User>;
  loggedUser: User;

  showUserDetails: boolean = false;

  reviews: Review[] = [];
  reviews$: Observable<Review[]>;

  averageReview: number;
  isRatingReadonly: boolean = true;
  review: Review = {
    stars: 0,
    message: ''
  };

  subscriptions: Subscription[] = [];

  @ViewChild('popup')
  reviewPopup: IPopup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    this.subscriptions.push(
      this.route.paramMap.subscribe(paramMap => {
        this.spinnerService.show();
        const uid = paramMap.get('id');
        this.user$ = this.userService.getUser(uid).pipe(
          tap(user => {
            this.user = user;
            this.reviews$ = this.userService.getUserReviews(this.user.uid).pipe(
              tap(reviews => {
                this.reviews = reviews;
                if (reviews) {
                  this.setIsRatingReadonly();
                  this.setAverageReview();
                }
              })
            );
            this.spinnerService.hide();
          })
        );
      })
    );

    this.loggedUser$ = this.authService.user$.pipe(
      tap(loggedUser => {
        this.loggedUser = loggedUser;
        this.checkToShowUserDetails(loggedUser);
        if (!isNullOrUndefined(loggedUser)) {
          this.review.user = {
            displayName: loggedUser.displayName,
            photoUrl: loggedUser.photoUrl
          };
          this.setIsRatingReadonly();
        }
      })
    );

    this.subscriptions.push(
      this.authService.userRef().subscribe(userRef => {
        if (!isNullOrUndefined(userRef)) this.review.userRef = userRef;
      })
    );
  }

  /**
   * Sets the stars from rating to be readonly
   */
  setIsRatingReadonly() {
    if (!this.loggedUser) {
      this.isRatingReadonly = true;
      return;
    }

    let hasSubmittedReviewBefore =
      this.reviews.find(review => review.userRef.id === this.loggedUser.uid) !==
      undefined;
    this.isRatingReadonly = !this.showUserDetails || hasSubmittedReviewBefore;
    if (!this.isRatingReadonly) {
      this.reviewPopup && this.reviewPopup.open();
      setTimeout(() => this.reviewPopup.close(), 3000);
    } else {
      this.reviewPopup && this.reviewPopup.close();
    }
  }

  /**
   * Sets the computed average review
   */
  setAverageReview() {
    this.averageReview = this.userService
      .getUserAverageReview(this.reviews)
      .valueOf();
  }

  /**
   * Handles add review action
   */
  addReview() {
    this.review.date = new Date();
    this.review.stars = this.averageReview;
    this.dialog.open(AddReviewComponent, {
      width: '500px',
      maxWidth: '93%',
      data: { user: this.user, review: this.review }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  checkToShowUserDetails(loggedUser: User) {
    const userProfileType = this.user.userProfile.userType; // user from page (not logged user)
    if (!loggedUser || loggedUser.userProfile.userType === userProfileType) {
      this.showUserDetails = false;
      return;
    }

    if (userProfileType === UserType.Employee) {
      this.showUserDetails = this.userService.checkUsersAreLinked(
        this.user,
        loggedUser
      );
    } else {
      this.showUserDetails = this.userService.checkUsersAreLinked(
        loggedUser,
        this.user
      );
    }
  }
}
