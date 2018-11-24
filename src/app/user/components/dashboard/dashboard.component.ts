import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  user$: Observable<User>;
  menuItems = [
    {
      icon: 'chart bar outline',
      text: 'Dashboard',
      link: user => [`/user/${user.uid}`, { outlets: { dashboard: ['home'] } }]
    },
    {
      icon: 'briefcase',
      text: 'Add job',
      link: user => [`/user/${user.uid}`, { outlets: { dashboard: ['job'] } }]
    }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user$ = this.auth.user$;
  }
}
