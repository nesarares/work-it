import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  imports: [CommonModule, SharedModule, UserRoutingModule, InfiniteScrollModule],
  declarations: [
    DashboardComponent,
    UserHomeComponent,
    JobDetailsComponent
  ]
})
export class UserModule {}
