import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import {
  TransitionController,
  Transition,
  TransitionDirection
} from 'ng2-semantic-ui';

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
    }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user$ = this.auth.user$;
  }
}
