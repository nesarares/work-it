import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserType } from 'src/app/shared/models/userType';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { User } from 'firebase';
import { UserProfile } from 'src/app/shared/models/userProfile';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.less']
})
export class CreateProfileComponent implements OnInit {
  userType?: UserType;
  employeeUserType?: UserType;
  employerUserType?: UserType;
  constructor() {}

  selectEmployee() {
    this.userType = UserType.Employee;
  }

  selectEmployer() {
    this.userType = UserType.Employer;
  }

  resetUser() {
    this.userType = undefined;
  }

  ngOnInit() {
    this.userType = undefined;
    this.employeeUserType = UserType.Employee;
    this.employerUserType = UserType.Employer;
  }
}
