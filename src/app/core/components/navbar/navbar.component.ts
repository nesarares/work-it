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
    this.auth.user$.subscribe(user => {
      this.user = user;
      if (!user) return;
      this.notifications$ = this.userService
        .getUserNotifications(user.uid)
        .pipe(
          tap(notifications => {
            this.notificationsNumber = notifications ? notifications.length : 0;
          })
        );
    });
  }

  /**
   * Handles sign out action
   */
  signOut() {
    this.auth.signOut();
  }

  /**
   * Utility function used to open the menu on the phone
   */
  openMobileMenu() {
    this.mobileMenuActive = true;
  }

  /**
   * Utility function used to close the menu on the phone
   */
  closeMobileMenu() {
    this.mobileMenuActive = false;
  }

  /**
   * Returns a string used to display an icon coresponding to notification type
   * @param notificationType: string, type of notification
   */
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

  /**
   * Handles delete notification action
   * @param userId: string, the id of the current user
   * @param notificationId: string, the id of notification
   */
  deleteNotification(userId: string, notificationId: string) {
    this.userService.deleteNotification(userId, notificationId);
  }

  /**
   * Used to navigate to a given url
   * @param url: string, representing the given url
   */
  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}
