import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.authService.user$.pipe(take(1)).subscribe(() => this.spinner.hide());
  }
}
