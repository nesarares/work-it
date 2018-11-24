import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { CreateProfileGuard } from './guards/create-profile.guard';

const routes: Routes = [
  {
    path: ':id',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        outlet: 'dashboard'
      },
      {
        path: 'home',
        component: UserHomeComponent,
        outlet: 'dashboard'
      },
      {
        path: 'job',
        component: JobDetailsComponent,
        outlet: 'dashboard'
      }]
  },
  {
    path: ':id/create-profile',
    component: CreateProfileComponent,
    canActivate: [CreateProfileGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
