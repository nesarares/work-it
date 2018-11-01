import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginError: string;
  user = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthService) {}

  ngOnInit() {}

  googleLogin() {
    this.auth.googleLogin().catch(error => (this.loginError = error));
  }
}
