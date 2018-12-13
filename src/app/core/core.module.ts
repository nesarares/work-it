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

@NgModule({
  imports: [CommonModule, SharedModule, PasswordStrengthMeterModule, ParticlesModule],
  declarations: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    FooterComponent
  ],
  exports: [HomeComponent, LoginComponent, NavbarComponent, FooterComponent]
})
export class CoreModule {}
