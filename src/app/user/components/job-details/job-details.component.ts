import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Job } from 'src/app/shared/models/job';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.less']
})
export class JobDetailsComponent implements OnInit {
  tags: string;
  job: Job = {
    id: '',
    employerID: '',
    title: '',
    description: '',
    requirements: '',
    tags: [],
    period: '',
    salary: ''
  };

  constructor(private auth: AuthService, private afs: AngularFirestore) { }

  async ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      this.job.employerID = user.uid;
    });
  }

  splitTags() {
    this.job.tags = this.tags.split(" ");
  }

  addJob() {
    this.splitTags();

    const id = this.afs.createId();
    this.job.id = id;
    this.afs.collection("jobs").doc(id).set(this.job);
  }
}
