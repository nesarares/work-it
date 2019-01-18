import { AuthService } from 'src/app/shared/services/auth.service';

import { Component, OnInit, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { messages } from 'src/app/shared/constants/message-constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  usedEmail: string = undefined;
  registerForm: FormGroup;
  isFormSubmitted: boolean = false;
  passwordsAreMatching: boolean = true;
  passwordStrengthFeedback: string = undefined;
  strengthLevel: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirmedPassword: ['', Validators.required]
    });
  }

  ngOnInit() {}

  /**
   * Handles an event triggered when the password strength changes
   * @param strengthValue:number, the password's strength
   */
  handleStrengthChanged(strengthValue: number) {
    this.passwordStrengthFeedback =
      messages.passwordStrengthMessages[strengthValue];
    this.strengthLevel = strengthValue;
  }

  /**
   * Handles on submit action
   * The email, password and passwordConfirmed  are taken from the fields
   * If the password strength is accepted, then the user account is created
   */
  onSubmit() {
    this.isFormSubmitted = true;

    const email: string = this.registerForm.controls.email.value;
    const password: string = this.registerForm.controls.password.value;
    const passwordConfirm = this.registerForm.controls.confirmedPassword.value;

    this.passwordsAreMatching = passwordConfirm === password;

    if (!this.passwordsAreMatching || this.strengthLevel < 2) return;

    this.authService
      .emailSignUp(email, password)
      .then(() => {
        this.authService.signOut();
        // this.router.navigate(['/login']);
        //this.router.navigate([`/user/${logedInUser.uid}/create-profile`]);
      })
      .catch(err => {
        this.usedEmail = err.message;
      });
  }
}
