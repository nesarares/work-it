import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private afs: AngularFirestore) {}

  addJob(job: Job) {
    const id = this.afs.createId();
    job.id = id;
    this.afs
      .collection('jobs')
      .doc(id)
      .set(job);
  }
}
