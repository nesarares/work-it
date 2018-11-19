import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() { }

  async googleLogin() {
    try {
      const user = await this.auth.googleLogin()
      this.router.navigateByUrl(`/user/${user.uid}`);
    } catch (error) {
      this.loginError = error;
    }
  }

  emailLogin() {
    this.auth
      .emailLogin(this.user.email, this.user.password)
      .catch(error => (this.loginError = error))
      .then((logedInUser) => this.router.navigate([`/user/${logedInUser.uid}`]));
  }
}
