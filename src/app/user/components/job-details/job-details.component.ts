import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Job } from 'src/app/shared/models/job';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.less']
})
export class JobDetailsComponent implements OnInit {
  addJobError: string;
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
    console.log("SALUUUUUUUUUUUT")
    const user: User = await this.auth.user$.toPromise();
    this.job.employerID = user.uid;
    console.log(user, "****************************************")
  }

  validateFields() {
    let errors: string = "";
    if (this.job.title === "") errors = errors.concat("Job title cannot be empty. ");
    if (this.job.description === "") errors = errors.concat("Job description cannot be empty. ");
    if (this.job.requirements === "") errors = errors.concat("Requirements field cannot be empty. ");
    if (this.job.period === "") errors = errors.concat("Period cannot be empty.");

    if (errors !== "") {
      this.addJobError = "Following errors have been found: " + errors;
    }
  }

  splitTags() {
    this.job.tags = this.tags.split(" ");
  }

  addJob() {
    this.addJobError = "";
    this.validateFields();
    if (this.addJobError !== "") return;

    this.splitTags();

    const id = this.afs.createId();
    this.job.id = id;
    this.afs.collection("jobs").doc(id).set(this.job);
  }

}
