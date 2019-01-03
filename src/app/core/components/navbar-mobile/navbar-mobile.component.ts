import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.less']
})
export class NavbarMobileComponent implements OnInit {
  @Input()
  menuItemsTop;

  @Input()
  menuItemsBottom;

  @Output()
  onClose: EventEmitter<boolean> = new EventEmitter();

  user$: Observable<User>;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
    this.onClose.emit(true);
  }

  signOut() {
    this.authService.signOut();
    this.onClose.emit(true);
  }
}
