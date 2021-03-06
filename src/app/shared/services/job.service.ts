import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference
} from '@angular/fire/firestore';
import { Job } from '../models/job';
import { map, filter } from 'rxjs/operators';
import { tagColoros } from '../constants/colors';
import { Observable, of } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { AuthService } from './auth.service';
import { Application } from '../models/application';
import { User } from '../models/user';
import { isNullOrUndefined } from 'util';
import { intersection, toLower } from '../utils/utils';
import { UserService } from './user.service';
import { Notification } from '../models/notification';
import { NotificationType } from '../models/notificationType';
import { UserType } from '../models/userType';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsCollection: AngularFirestoreCollection<Job>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.jobsCollection = this.afs.collection<Job>('jobs');
  }

  /**
   * Adds a job in the database
   * @param job: Job, the job that will be added
   * @param employerId: string, representig the employer`s id
   */
  addJob(job: Job, employerId: string) {
    const id = this.afs.createId();
    job.id = id;
    job.employerRef = this.afs.collection('users').doc(employerId).ref;
    job.isActive = true;
    this.jobsCollection.doc(id).set(job);
  }

  /**
   * Updates a job from the database
   * @param job: Job, the job that will be updated
   */
  updateJob(job: Job) {
    return this.jobsCollection.doc(job.id).set(job);
  }

  /**
   * Deletes a job from the database
   * @param job: Job, the job that will be deleted
   */
  deleteJob(jobId: string) {
    return this.jobsCollection.doc(jobId).delete();
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
   * Get the job from the database based on id
   * @param jobId: string, representing the job's id
   */
  getJobById(jobId: string): Observable<Job> {
    return this.jobsCollection.doc<Job>(jobId).valueChanges();
  }

  /**
   * Returns a list of jobs from database filtered by a given condition
   * @param filters: Object, reepresenting the filter condition
   */
  getJobsFiltered(filters: any = {}) {
    return this.afs
      .collection<Job>('jobs', ref =>
        ref.where('isActive', '==', true).orderBy('publishedDate', 'desc')
      )
      .valueChanges()
      .pipe(
        map(jobsArray => {
          return jobsArray.filter(job => {
            let ok = true;
            if (filters.title)
              ok =
                ok &&
                job.title.toLowerCase().includes(filters.title.toLowerCase());

            if (filters.employer)
              ok =
                ok &&
                job.employer.displayName
                  .toLowerCase()
                  .includes(filters.employer.toLowerCase());

            if (filters.tags)
              ok =
                ok &&
                intersection(job.tags.map(toLower), filters.tags.map(toLower))
                  .length !== 0;
            if (filters.city) ok = ok && job.city === filters.city;
            return ok;
          });
        })
      );
  }

  /**
   * Returns an observable of an array of relevant jobs based on
   * the given user's tags. Must have at least two common tags.
   * If the user is an employer, returns the employer's jobs.
   * @param user the user for which to get the relevant jobs
   */
  getJobsByUserInterests(user: User): Observable<Job[]> {
    const userProfile = user.userProfile;
    if (!userProfile) return of(null);

    if (userProfile.userType === UserType.Employer) {
      const userRef = this.afs.collection('users').doc(user.uid).ref;
      return this.getJobsByEmployer(userRef);
    }

    let userTags = userProfile.tags;
    if (!userTags) return of(null);

    const userApplications = user.applications;

    userTags = userTags.map(tag => tag.toLowerCase());

    return this.getJobs().pipe(
      map(jobs =>
        jobs.filter(job => {
          if (
            !job.tags ||
            (userApplications &&
              userApplications.some(app => app.jobRef.id === job.id))
          )
            return false;
          const jobTags = job.tags.map(tag => tag.toLowerCase());
          return intersection(jobTags, userTags).length > 1;
        })
      )
    );
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

  /**
   * Returns the size of the jobs collection
   */
  private async getCollectionSize() {
    return (await this.jobsCollection.get().toPromise()).docs.length;
  }

  /**
   * Adds a job application
   * @param job: Job, the application`s job
   * @param user: User, the user that applies to the job
   * @param date: Date, the date of applying
   * @param message: string, the application`s message
   */
  async addJobApplication(job: Job, user: User, date: Date, message: string) {
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
      employerRef: job.employerRef,
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

    const jobTitleShort =
      job.title.length > 20 ? `${job.title.substr(0, 20)}...` : job.title;
    const notification: Notification = {
      date: new Date(),
      type: NotificationType.NEW_APPLICATION,
      message: `You have a new application for "${jobTitleShort}"`,
      link: `/jobs/${job.id}`
    };
    this.userService.addNotification(job.employerRef.id, notification);
  }

  /**
   * Accepts a user application on a specific job
   * @param userId: string, the id of the user which applies to the job
   * @param job: Job, the job which the user wants to apply
   */
  acceptApplication(userId: string, job: Job) {
    const application = job.applications.find(
      application => application.employeeRef.id === userId
    );
    if (!application) return;
    application.accepted = true;
    const ret = this.afs
      .collection('jobs')
      .doc(job.id)
      .update({ applications: job.applications });

    application.employeeRef.get().then(employeeDoc => {
      // set accepted to true in user's application
      // should be a cloud function
      const employee: User = employeeDoc.data() as User;
      const app = employee.applications.find(
        application => application.jobRef.id === job.id
      );
      app.accepted = true;
      application.employeeRef.update({ applications: employee.applications });
    });

    const jobTitleShort =
      job.title.length > 20 ? `${job.title.substr(0, 20)}...` : job.title;
    const notification: Notification = {
      date: new Date(),
      type: NotificationType.APPLICATION_ACCEPTED,
      message: `Your application for "${jobTitleShort}" has been accepted!`,
      link: `/jobs/${job.id}`
    };
    this.userService.addNotification(userId, notification);

    return ret;
  }

  /**
   * Returns a list of jobs based on the employer of the jobs
   * @param userRef: DocumentReference, representig the employer user refference
   */
  getJobsByEmployer(userRef: DocumentReference) {
    return this.afs
      .collection<Job>('jobs', ref =>
        ref.where('employerRef', '==', userRef).orderBy('publishedDate', 'desc')
      )
      .valueChanges();
  }
}
