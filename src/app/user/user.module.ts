import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExampleComponent } from './components/example/example.component';
import { UserHomeComponent } from './components/user-home/user-home.component';

@NgModule({
  imports: [CommonModule, SharedModule, UserRoutingModule],
  declarations: [DashboardComponent, ExampleComponent, UserHomeComponent]
})
export class UserModule {}
