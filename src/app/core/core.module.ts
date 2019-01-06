import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { FooterComponent } from './components/footer/footer.component';
import { ParticlesModule } from 'angular-particle';
import { NavbarMobileComponent } from './components/navbar-mobile/navbar-mobile.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { JsonpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PasswordStrengthMeterModule,
    ParticlesModule,
    JsonpModule
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    FooterComponent,
    NavbarMobileComponent,
    PrivacyPolicyComponent
  ],
  exports: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    PrivacyPolicyComponent
  ]
})
export class CoreModule {}
