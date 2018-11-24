import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExampleComponent } from './components/example/example.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';

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
        path: 'example',
        component: ExampleComponent,
        outlet: 'dashboard'
      }]
  },
  {
    path: ':id/create-profile',
    component: CreateProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
