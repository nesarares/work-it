import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { CreateProfileEmployerComponent } from './components/create-profile-employer/create-profile-employer.component';
import { CreateProfileEmployeeComponent } from './components/create-profile-employee/create-profile-employee.component';

@NgModule({
  imports: [CommonModule, SharedModule, UserRoutingModule],
  declarations: [DashboardComponent, UserHomeComponent, CreateProfileComponent, JobDetailsComponent, CreateProfileEmployerComponent, CreateProfileEmployeeComponent]
})
export class UserModule {}
