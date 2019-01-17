import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { NotificationType } from 'src/app/shared/models/notificationType';
import { UserService } from 'src/app/shared/services/user.service';
import { tap } from 'rxjs/operators';
import { Notification } from 'src/app/shared/models/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  user$: Observable<User>;
  user: User;

  notifications$: Observable<Notification[]>;
  notificationsNumber: number = 0;

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
    },
    {
      icon: 'envelope',
      text: 'Contact us',
      link: '/contact'
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

  constructor(
    private auth: AuthService,
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user$ = this.auth.user$.pipe(
      tap(usr => {
        console.log({ usr });
        this.user = usr;
        if (!usr) return;
        this.notifications$ = this.userService
          .getUserNotifications(usr.uid)
          .pipe(
            tap(notifications => {
              this.notificationsNumber = notifications
                ? notifications.length
                : 0;
            })
          );
      })
    );
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

  deleteNotification(userId: string, notificationId: string) {
    this.userService.deleteNotification(userId, notificationId);
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}
