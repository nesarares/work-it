import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Job } from '../models/job';
import { map } from 'rxjs/operators';
import { tagColoros } from '../constants/colors';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private afs: AngularFirestore) {}

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
   * Returns a list of jobs satisfiyng a given condition
   * @param queryParam - the given condition
   */
  getJobs(
    queryParam = {
      orderBy: 'publishedDate',
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
      .get()
      .pipe(
        map(querySnapshot => {
          let jobs = queryParam.old;

          if (queryParam.old.length >= limit) {
            return jobs;
          }

          querySnapshot.forEach(async doc => {
            let newItem = doc.data();

            // remove the first element of the list, because is already displayed
            if (jobs.length > 0 && newItem.id == jobs[jobs.length - 1].id) {
              return;
            }

            jobs.push(newItem);
          });

          return jobs;
        })
      );
  }

  /**
   * Returns an observable of jobs list
   */
  getObservaleJobs() {
    return this.afs.collection('jobs').valueChanges();
  }

  /**
   * Get the job
   * @param jobId: string representing the job's id
   */
  getJobById(jobId: string): Observable<Job> {
    return this.afs
      .collection('jobs')
      .doc<Job>(jobId)
      .valueChanges();
  }

  /**
   * Returns all jobs from database
   */
  getAllJobs(): Observable<Job[]> {
    return this.afs.collection<Job>('jobs').valueChanges();
  }

  /**
   * Get a map containing all tags once with its associated color
   */
  getMappedTags() {
    let mappedTags: Map<string, string> = new Map();

    this.getAllJobs().subscribe(jobs => {
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
    });

    return mappedTags;
  }

  /**
   * Function for paggination
   */
  private getQueryForm(queryParam, ref) {
    let query = ref.orderBy(queryParam.orderBy as string);

    if (!queryParam.startingAt) {
      return query.limit(queryParam.limitTo as number);
    }

    return query
      .startAt(queryParam.startingAt as string)
      .limit((queryParam.limitTo as number) + 1);
  }

  private async getCollectionSize() {
    return (await this.afs
      .collection('jobs')
      .get()
      .toPromise()).docs.length;
  }

  private async asyncForEach(array, callback) {
    for (let idx = 0; idx < array.length; ++idx) {
      await callback(array[idx], idx, array);
    }
  }
}
