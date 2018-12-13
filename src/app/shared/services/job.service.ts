import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Job } from '../models/job';
import { map } from 'rxjs/operators';
import { tagColoros } from '../constants/colors';
import { Observable } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { AuthService } from './auth.service';
import { Application } from '../models/application';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsCollection: AngularFirestoreCollection<Job>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.jobsCollection = this.afs.collection<Job>('jobs');
  }

  addJob(job: Job, employerId: string) {
    const id = this.afs.createId();
    job.id = id;
    job.employerRef = this.afs.collection('users').doc(employerId).ref;
    this.jobsCollection.doc(id).set(job);
  }

  /**
   * Returns all jobs from database
   */
  getJobs(): Observable<Job[]> {
    return this.jobsCollection.valueChanges();
  }

  /**
   * Returns a list of jobs satisfiyng a given condition
   * @param queryParam - the given condition
   */
  getJobsByQueryParam(
    queryParam = {
      orderBy: 'id',
      startingAt: undefined,
      limitTo: 5,
      old: []
    }
  ) {
    // get the number of elements from database
    let limit;
    this.getCollectionSize().then(x => (limit = x));

    return this.afs
      .collection<Job>('jobs', ref => this.getQueryForm(queryParam, ref))
      .valueChanges()
      .pipe(
        map(jobsArray => {
          let jobs = queryParam.old;

          if (queryParam.old.length >= limit) {
            return jobs;
          }

          jobsArray.forEach(job => {
            // remove the first element of the list, because is already displayed
            if (jobs.length > 0 && job.id == jobs[jobs.length - 1].id) {
              return;
            }

            jobs.push(job);
          });

          return jobs;
        })
      );
  }

  /**
   * Get the job
   * @param jobId: string representing the job's id
   */
  getJobById(jobId: string): Observable<Job> {
    return this.jobsCollection.doc<Job>(jobId).valueChanges();
  }

  /**
   * Get a map containing all tags once with its associated color
   */
  getMappedTags() {
    return this.getJobs().pipe(
      map(jobs => {
        let mappedTags: Map<string, string> = new Map();
        jobs.forEach(job => {
          if (!job.tags) {
            return;
          }

          job.tags.forEach(tag => {
            if (!mappedTags[tag]) {
              mappedTags.set(tag, 'default');
            }
          });
        });

        let index = 0;
        mappedTags.forEach((value: string, key: string) => {
          mappedTags.set(
            key,
            tagColoros.colors[index++ % tagColoros.colors.length]
          );
        });

        return mappedTags;
      })
    );
  }

  /**
   * Function for paggination
   */
  private getQueryForm(queryParam, ref) {
    let query = ref.orderBy(queryParam.orderBy as string, 'desc');

    if (!queryParam.startingAt) {
      return query.limit(queryParam.limitTo as number);
    }

    return query
      .startAt(queryParam.startingAt as string)
      .limit((queryParam.limitTo as number) + 1);
  }

  private async getCollectionSize() {
    return (await this.jobsCollection.get().toPromise()).docs.length;
  }

  addJobApplication(job: Job, user: User, date: Date, message: string) {
    const employeeRef = this.afs.collection('users').doc(user.uid).ref;
    const displayName = this.authService.user.displayName;
    const photoUrl = this.authService.user.photoUrl;

    const jobRef = this.afs.collection('jobs').doc(job.id).ref;
    const employerName = job.employer.displayName;
    const employerPhotoUrl = job.employer.photoUrl;
    const title = job.title;

    const applicationJob: Application = {
      date,
      employeeRef,
      employee: { displayName, photoUrl },
      message
    };
    const applicationUser: Application = {
      date,
      jobRef,
      job: { title, employerName, employerPhotoUrl },
      message
    };

    if (!job.applications) job.applications = [];
    if (!user.applications) user.applications = [];
    job.applications.push(applicationJob);
    user.applications.push(applicationUser);

    this.afs
      .collection('jobs')
      .doc(job.id)
      .update(job);
    this.afs
      .collection('users')
      .doc(user.uid)
      .update(user);
  }
}
