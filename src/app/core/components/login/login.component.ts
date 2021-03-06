import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginError: string;
  errorType: string = 'error';

  user = {
    email: '',
    password: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  /**
   * Handles the login with google account
   * On success, the user is redirected to dashboard if the user has a profile otherwise
   * to create profile page
   */
  async googleLogin() {
    this.spinner.show();
    try {
      const user = await this.auth.googleLogin();
      this.router.navigateByUrl(`/user/${user.uid}`);
    } catch (error) {
      this.loginError = error;
    } finally {
      this.spinner.hide();
    }
  }

  /**
   * Handles the login with facebook account
   * On success, the user is redirected to dashboard if the user has a profile otherwise
   * to create profile page
   */
  async facebookLogin() {
    this.spinner.show();
    try {
      const user = await this.auth.facebookLogin();
      this.router.navigateByUrl(`/user/${user.uid}`);
    } catch (error) {
      this.loginError = error;
    } finally {
      this.spinner.hide();
    }
  }

  /**
   * Handles the login with email account
   * On success, the user is redirected to dashboard if the user has a profile otherwise
   * to create profile page
   */
  async emailLogin() {
    this.spinner.show();
    try {
      const user = await this.auth.emailLogin(
        this.user.email,
        this.user.password
      );
      this.router.navigate([`/user/${user.uid}`]);
      // window.location.reload(); // quick fix
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          this.loginError =
            'The email or password is incorrect. Please check the details and try again.';
          this.errorType = 'error';
          break;
        case 'auth/email-not-verified':
          this.loginError = 'Please verify your email first';
          this.errorType = 'warning';
          this.auth.signOut();
          break;
        default:
          this.loginError = error.message;
      }
    } finally {
      this.spinner.hide();
    }
  }
}
