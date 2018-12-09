import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { HomeComponent } from './core/components/home/home.component';
import { RegisterComponent } from './core/components/register/register.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { JobInfoComponent } from './core/components/job-info/job-info.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'job-info/:id',
    loadChildren: './core/core.module#CoreModule',
    component: JobInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
