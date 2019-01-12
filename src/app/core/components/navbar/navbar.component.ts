import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';

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
}
