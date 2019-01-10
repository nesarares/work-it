import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import {
  TransitionController,
  Transition,
  TransitionDirection
} from 'ng2-semantic-ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  isMenuOpen: boolean = true;
  user$: Observable<User>;
  menuItems = [
    {
      icon: 'dashboard',
      text: 'Dashboard',
      link: user => [`/user/${user.uid}`, { outlets: { dashboard: ['home'] } }]
    },
    {
      icon: 'work',
      text: 'Add job',
      link: user => [`/user/${user.uid}`, { outlets: { dashboard: ['job'] } }]
    },
    {
      icon: 'list',
      text: 'My jobs',
      link: user => [
        `/user/${user.uid}`,
        { outlets: { dashboard: ['my-jobs'] } }
      ]
    },
    {
      icon: 'done',
      text: 'My applications',
      link: user => [
        `/user/${user.uid}`,
        { outlets: { dashboard: ['my-applications'] } }
      ]
    }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$ = this.auth.user$;
  }

  navigateToUserProfile(uid: string) {
    this.router.navigateByUrl(`/user/${uid}/public`);
  }
}
