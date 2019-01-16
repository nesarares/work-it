import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/shared/models/userType';
import { AuthService } from 'src/app/shared/services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.less']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  user: User;
  loggedUser$: Observable<User>;
  subscriptions: Subscription[] = [];
  employeeUserType: number = UserType.Employee.valueOf();
  showUserDetails: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService
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
        console.log(loggedUser);
        this.checkToShowUserDetails(loggedUser);
      })
    );
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
