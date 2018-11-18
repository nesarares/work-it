import { AuthService } from 'src/app/shared/services/auth.service';

import { Component, OnInit, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

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
  passwordStrengthMessages: string[] = [
    "Password is very weak",
    "Password is weak",
    "Password is good",
    "Password is strong",
    "Password is very strong"];

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [
        Validators.required]
        // password must contain: at least one uppercase letter, one lowercase letter, one digit
        // and the lenght must be greater than 7
        // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]
      ],
      confirmedPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  handleStrengthChanged(strengthValue: number) {
    this.passwordStrengthFeedback = this.passwordStrengthMessages[strengthValue];
    this.strengthLevel = strengthValue
  }

  onSubmit() {

    this.isFormSubmitted = true;

    let email: string = this.registerForm.controls.email.value;
    let password: string = this.registerForm.controls.password.value;

    this.passwordsAreMatching = this.checkPasswords(
      this.registerForm.controls.confirmedPassword.value,
      password
    );

    if (!this.passwordsAreMatching) return;

    this.authService.emailSignUp(email, password).then(() => {
      this.router.navigate(['']);
    }).catch((err) => {
      this.usedEmail = err.message;
    })
  }


  // Checks if the password and confirmed password are the same
  private checkPasswords(password: string, confirmedPassword: string) {
    return password === confirmedPassword;
  }

}
