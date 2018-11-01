import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [HomeComponent, LoginComponent, RegisterComponent],
  exports: [HomeComponent, LoginComponent, RegisterComponent]
})
export class CoreModule {}
