import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/shared/models/userType';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.less']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  user: User;
  subscriptions: Subscription[] = [];
  employeeUserType: number = UserType.Employee.valueOf();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
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
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
