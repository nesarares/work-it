import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExampleComponent } from './components/example/example.component';
import { UserHomeComponent } from './components/user-home/user-home.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
