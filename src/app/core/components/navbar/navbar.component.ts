import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { NotificationType } from 'src/app/shared/models/notificationType';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  user$: Observable<User>;
  mobileMenuActive: boolean = false;
  menuItems = [
    {
      icon: 'home',
      text: 'Home',
      link: '/'
    },
    {
      icon: 'bullhorn',
      text: 'Jobs',
      link: '/jobs'
    }
  ];
  menuItemsUser = [
    {
      icon: 'dashboard',
      materialIcon: true,
      text: 'Dashboard',
      link: user => `/user/${user.uid}`
    }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user$ = this.auth.user$;
  }

  signOut() {
    this.auth.signOut();
  }

  openMobileMenu() {
    this.mobileMenuActive = true;
  }

  closeMobileMenu() {
    this.mobileMenuActive = false;
  }

  getIcon(notificationType: string): string {
    switch (notificationType) {
      case NotificationType.APPLICATION_ACCEPTED:
        return 'done';
      case NotificationType.LEAVE_REVIEW:
        return 'rate_review';
      case NotificationType.NEW_APPLICATION:
        return 'person_pin';
      case NotificationType.NEW_REVIEW:
        return 'star';
      default:
        return 'message';
    }
  }
}
