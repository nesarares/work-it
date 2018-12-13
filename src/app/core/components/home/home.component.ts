import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/shared/services/job.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Job } from 'src/app/shared/models/job';
import { User } from 'src/app/shared/models/user';
import { stripHtmlToText } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
