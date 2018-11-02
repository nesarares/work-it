import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  loggedIn = false;
  constructor(public auth: AuthService) {
    auth.user$.subscribe(user => (this.loggedIn = !!user));
  }
}
