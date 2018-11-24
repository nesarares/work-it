import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserType } from 'src/app/shared/models/userType';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from 'firebase';
import { UserProfile } from 'src/app/shared/models/userProfile';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.less']
})
export class CreateProfileComponent implements OnInit {
  companyUserType: UserType;
  normalUserType: UserType;
  userType?: UserType;
  firstName: string;
  lastName: string;
  companyName?: string;
  birthDate: Date;
  interests?: string;
  workExperience?: string;
  educationalExperience?: string;
  profileFormNormal: FormGroup;
  profileFormCompany: FormGroup;
  isFormNomalUserSubmitted: boolean;
  isFormCompanySubmitted: boolean;
  currentUser$: AngularFirestoreDocument<User>;
  id$:string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) {

    this.isFormCompanySubmitted = false;
    this.isFormNomalUserSubmitted = false;
    this.companyUserType = UserType.CompanyUser;
    this.normalUserType = UserType.NormalUser;
    this.profileFormNormal = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', Validators.required],
      interests: ['', Validators.maxLength(250)],
      workExperience: ['', Validators.maxLength(250)],
      educationalExperience: ['', Validators.maxLength(250)]
    });

    this.profileFormCompany = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]]
    });

    let sub = this.route.params.subscribe(params => {
      this.id$ = params['id'];
    });
    this.currentUser$ = this.afs.collection<User>('users').doc(this.id$);

    this.currentUser$.ref.get().then(function (doc) {
      if (!doc.exists) {
        alert("User not found.");
        this.router.navigate([`/home`]);
      }
    });
  }
  selectHire() {
    this.userType = UserType.CompanyUser;
  }

  selectFindJob() {
    this.userType = UserType.NormalUser;
  }
  resetUser() {
    this.userType = undefined;
  }

  onSubmit() {
    let userProfile: UserProfile;
    if (this.userType == UserType.CompanyUser) {
      this.isFormCompanySubmitted = true;
      if(this.profileFormCompany.status === 'VALID'){
        userProfile = {
          userType: this.userType,
          firstName: this.profileFormCompany.controls.firstName.value,
          lastName: this.profileFormCompany.controls.lastName.value,
          birthDate: this.profileFormCompany.controls.birthDate.value,
          companyName: this.profileFormCompany.controls.companyName.value
        }
          this.currentUser$.ref.update({userProfile:userProfile});
      }
     
    } else if (this.userType == UserType.NormalUser) {
      this.isFormNomalUserSubmitted = true;
      if(this.profileFormNormal.status === 'VALID'){
        userProfile = {
          userType: this.userType,
          firstName: this.profileFormNormal.controls.firstName.value,
          lastName: this.profileFormNormal.controls.lastName.value,
          birthDate: this.profileFormNormal.controls.birthDate.value,
          interests: this.profileFormNormal.controls.interests.value,
          workExperience: this.profileFormNormal.controls.workExperience.value,
          educationalExperience: this.profileFormNormal.controls.educationalExperience.value
        }
        this.currentUser$.ref.update({userProfile:userProfile}).then( res =>
            this.router.navigate([`/user/${this.id$}`])
        ).catch(function(fail){
          alert("Profile creation failed.")
          this.router.navigate([`/user/${this.id$}/create-profile`]);
        })
      }
    } else {
      return;
    }
  }
  ngOnInit() {
  }
}
