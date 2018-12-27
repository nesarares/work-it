import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { JobsListComponent } from './components/jobs-list/jobs-list.component';
import { JobInfoComponent } from './components/job-info/job-info.component';
import { JobDescriptionComponent } from './components/job-description/job-description.component';
import { JobSimilarComponent } from './components/job-similar/job-similar.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobApplicationComponent } from './components/job-application/job-application.component';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS
} from '@angular/material/dialog';
import { JobApplicationsListComponent } from './components/job-applications-list/job-applications-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    JobsRoutingModule,
    MatDialogModule
  ],
  declarations: [
    JobsListComponent,
    JobInfoComponent,
    JobDescriptionComponent,
    JobSimilarComponent,
    JobApplicationComponent,
    JobApplicationsListComponent
  ],
  entryComponents: [JobApplicationComponent]
})
export class JobsModule {}
