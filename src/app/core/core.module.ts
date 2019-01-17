import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { ParticlesModule } from 'angular-particle';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { apiKeys } from 'src/environments/apiKeys';
import { TimeAgoPipe } from 'time-ago-pipe';

import { SharedModule } from '../shared/shared.module';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarMobileComponent } from './components/navbar-mobile/navbar-mobile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './components/register/register.component';

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
    ContactComponent,
    TimeAgoPipe
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
