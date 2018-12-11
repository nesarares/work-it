import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsListComponent } from './components/jobs-list/jobs-list.component';
import { JobInfoComponent } from './components/job-info/job-info.component';

const routes: Routes = [
  {
    path: '',
    component: JobsListComponent
  },
  {
    path: ':id',
    component: JobInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule {}
