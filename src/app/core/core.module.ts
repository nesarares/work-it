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
import { ContactComponent } from './components/contact/contact.component';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { apiKeys } from 'src/environments/apiKeys';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PasswordStrengthMeterModule,
    ParticlesModule,
    JsonpModule,
    AgmCoreModule.forRoot({
      apiKey: apiKeys.mapsApiKey
    }),
    HttpClientModule
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    FooterComponent,
    NavbarMobileComponent,
    PrivacyPolicyComponent,
    ContactComponent
  ],
  exports: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    ContactComponent,
    PrivacyPolicyComponent
  ]
})
export class CoreModule {}
