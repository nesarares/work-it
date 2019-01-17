import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.less']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  user: User;
  loggedUser$: Observable<User>;
  loggedUser: User;
  subscriptions: Subscription[] = [];
  employeeUserType: number = UserType.Employee.valueOf();
  review: Review = {
    stars: 0,
    message: ''
  };
  averageReview: number;
  showUserDetails: boolean = false;
  reviews: Review[] = [];
  isRatingReadonly: boolean = false;

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

        console.log({ user });
        this.spinnerService.hide();
      })
    );

    this.loggedUser$ = this.authService.user$.pipe(
      tap(loggedUser => {
        this.loggedUser = loggedUser;
        console.log(loggedUser);
        this.checkToShowUserDetails(loggedUser);
        if (!isNullOrUndefined(loggedUser)) {
          this.review.user = {
            displayName: loggedUser.displayName,
            photoUrl: loggedUser.photoUrl
          };
          this.subscriptions.push(
            this.userService
              .getUserReviews(this.user.uid)
              .subscribe(reviews => {
                this.reviews = reviews;
                if (reviews) {
                  this.setIsRatingReadonly();
                  this.setAverageReview();
                }
              })
          );
        }
      })
    );

    this.subscriptions.push(
      this.authService.userRef().subscribe(userRef => {
        if (!isNullOrUndefined(userRef)) this.review.userRef = userRef;
      })
    );
  }

  setIsRatingReadonly() {
    let hasSubmittedReviewBefore =
      this.reviews.find(review => review.userRef.id === this.loggedUser.uid) !==
      undefined;
    this.isRatingReadonly = !this.showUserDetails || hasSubmittedReviewBefore;
  }

  setAverageReview() {
    this.averageReview = this.userService
      .getUserAverageReview(this.reviews)
      .valueOf();
  }

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
    if (!loggedUser || loggedUser.userProfile.userType === userProfileType)
      this.showUserDetails = false;

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
