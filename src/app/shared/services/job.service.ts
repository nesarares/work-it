import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Job } from '../models/job';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private afs: AngularFirestore) {
    this.getJobs();
  }

  addJob(job: Job, employerId: string) {
    const id = this.afs.createId();
    job.id = id;
    job.employerRef = this.afs.collection('users').doc(employerId).ref;

    this.afs
      .collection('jobs')
      .doc(id)
      .set(job);
  }

  /**
   * Returns job list
   */
  getJobs() {
    return this.afs
    .collection('jobs')
    .get()
    .pipe(
      map(querySnapshot => {
          const jobs = [];
          querySnapshot.forEach(async doc =>{
            let newItem = doc.data();
            if(newItem.employerRef){
              const res = await newItem.employerRef.get();
              newItem.employer = res.data();
            }
            jobs.push(newItem);
          })
          return jobs;
      })
    );
  }

   /**
   * Returns an observable of jobs list
   */
  getObservaleJobs(){
    return this.afs.collection('jobs').valueChanges();
  }

  /**
   * Get the job 
   * @param jobId: string representing the job's id 
   */
  getJobById(jobId: string){
      return this.afs.doc<Job>(`jobs/${jobId}`).valueChanges();
  }
}
