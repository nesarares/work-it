import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserType } from 'src/app/shared/models/userType';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  isMenuOpen: boolean = true;
  user$: Observable<User>;

  // Represents the options of the user`s menu with coresponding routes
  menuItems = [
    {
      icon: 'dashboard',
      text: 'Dashboard',
      link: user => [`/user/${user.uid}`, { outlets: { dashboard: ['home'] } }]
    },
    {
      icon: 'work',
      text: 'Add job',
      userType: UserType.Employer.valueOf(),
      link: user => [`/user/${user.uid}`, { outlets: { dashboard: ['job'] } }]
    },
    {
      icon: 'list',
      text: 'My jobs',
      userType: UserType.Employer.valueOf(),
      link: user => [
        `/user/${user.uid}`,
        { outlets: { dashboard: ['my-jobs'] } }
      ]
    },
    {
      icon: 'done',
      text: 'My applications',
      userType: UserType.Employee.valueOf(),
      link: user => [
        `/user/${user.uid}`,
        { outlets: { dashboard: ['my-applications'] } }
      ]
    },
    {
      icon: 'settings',
      text: 'Edit profile',
      link: user => [
        `/user/${user.uid}`,
        { outlets: { dashboard: ['settings'] } }
      ]
    }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.user$;
  }

  /**
   * Navigates to a user profile with id @param uid
   * @param uid: string, representing the user`s id
   */
  navigateToUserProfile(uid: string) {
    this.router.navigateByUrl(`/user/${uid}/public`);
  }
}
