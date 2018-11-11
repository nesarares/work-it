import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [HomeComponent, LoginComponent, NavbarComponent, RegisterComponent],
  exports: [HomeComponent, LoginComponent, NavbarComponent]
})
export class CoreModule {}
