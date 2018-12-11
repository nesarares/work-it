import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { JobsListComponent } from './components/jobs-list/jobs-list.component';
import { JobInfoComponent } from './components/job-info/job-info.component';
import { JobDescriptionComponent } from './components/job-description/job-description.component';
import { JobSimilarComponent } from './components/job-similar/job-similar.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { JobsRoutingModule } from './jobs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    JobsRoutingModule
  ],
  declarations: [
    JobsListComponent,
    JobInfoComponent,
    JobDescriptionComponent,
    JobSimilarComponent
  ]
})
export class JobsModule {}
