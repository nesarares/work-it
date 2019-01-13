import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';

import { SharedModule } from '../shared/shared.module';
import { CreateProfileEmployeeComponent } from './components/create-profile-employee/create-profile-employee.component';
import { CreateProfileEmployerComponent } from './components/create-profile-employer/create-profile-employer.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserRoutingModule } from './user-routing.module';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { UserJobsComponent } from './components/user-jobs/user-jobs.component';
import { UserApplicationsComponent } from './components/user-applications/user-applications.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: [2, 3, 4, false] }],

          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme

          ['clean'] // remove formatting button
        ]
      }
    })
  ],
  declarations: [
    DashboardComponent,
    UserHomeComponent,
    CreateProfileComponent,
    JobDetailsComponent,
    CreateProfileEmployerComponent,
    CreateProfileEmployeeComponent,
    PublicProfileComponent,
    UserJobsComponent,
    UserApplicationsComponent,
    UserSettingsComponent
  ]
})
export class UserModule {}
