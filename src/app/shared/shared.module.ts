import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { NgxSpinnerModule } from 'ngx-spinner';

import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { MessageComponent } from './components/message/message.component';
import { BadgeGroupComponent } from './components/badge-group/badge-group.component';
import { EmptyPlaceholderComponent } from './components/empty-placeholder/empty-placeholder.component';
import { JobViewComponent } from './components/job-view/job-view.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgxSpinnerModule,
    RouterModule
  ],
  declarations: [
    MessageComponent,
    LoadingIndicatorComponent,
    BadgeGroupComponent,
    EmptyPlaceholderComponent,
    JobViewComponent,
    StatsCardComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    RouterModule,
    MessageComponent,
    LoadingIndicatorComponent,
    BadgeGroupComponent,
    EmptyPlaceholderComponent,
    JobViewComponent,
    StatsCardComponent
  ],
  providers: []
})
export class SharedModule {}
