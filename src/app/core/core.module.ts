import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { JobsListComponent } from './components/jobs-list/jobs-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { JobInfoComponent } from './components/job-info/job-info.component';
import { JobDescriptionComponent } from './components/job-description/job-description.component';
import { JobSimilarComponent } from './components/job-similar/job-similar.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PasswordStrengthMeterModule,
    InfiniteScrollModule
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    JobsListComponent,
    JobInfoComponent,
    JobDescriptionComponent,
    JobSimilarComponent
  ],
  exports: [HomeComponent, LoginComponent, NavbarComponent]
})
export class CoreModule {}
