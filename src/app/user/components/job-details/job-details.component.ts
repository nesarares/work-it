import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.less']
})
export class JobDetailsComponent implements OnInit {
  addJobError: string;
  job = {
    title: '',
    description: '',
    requirements: '',
    tags: [],
    period: '',
    salary: ''
  };

  constructor(private auth: AuthService) { }

  ngOnInit() {
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

  addJob() {
    this.addJobError = "";
    this.validateFields();
  }

}
