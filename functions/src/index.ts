import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { emailingKeys } from './emailingKeys';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://work-it-235.firebaseio.com'
});

// const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailingKeys.gmailEmail,
    pass: emailingKeys.gmailPassword
  }
});

/**
 * Sends mail to the user
 * @param userEmail user email
 * @param userDisplayName user display name
 * @param commonTags common tags
 * @param jobId job id
 */
function sendNewsMail(
  userEmail: string,
  userDisplayName: string,
  commonTags: string[],
  jobId: string
) {
  const mailOptions = {
    from: `workit.235@gmail.com`,
    to: userEmail,
    subject: `We found some jobs that you might like.`,
    text: `Hi, ${userDisplayName}!

A new job was found that might interest you with the following common tags: ${commonTags.join(', ')}. 
https://work-it.ml/jobs/${jobId}

If you don't want to recieve this types of mails or you did not subscribe to them, please log in to your account at https://work-it.ml/login and disable notifications on your profile.

Sincerely,
Work-It Team - Put your free time to good use!
`
  };
  console.log('sending email...', mailOptions);

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Job email sent to: ' + userEmail);
  });
}

/**
 * This function will send a newsletter email to users email
 */
exports.functionNotifyNewJob = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snap, context) => {
    const job = snap.data();

    // Check if the job has at least 2 tags
    if (job.tags === undefined || job.tags.length < 2) {
      return;
    }
    // Get all users that subscribed to the newsletter
    let querry = admin
      .firestore()
      .collection('users')
      .where('userProfile.newsletter', '==', true);

    // Filter only users that have common tags with the job
    const users = await querry.get();
    for (const user of users.docs) {
      const userData = user.data();
      // console.log(userData);
      // console.log('user tags:', userData.userProfile.tags);
      if (!userData.userProfile || !userData.userProfile.tags) {
        continue;
      }

      var setA: string[] = Array.from(new Set(job.tags));
      var setB: string[] = Array.from(new Set(userData.userProfile.tags));
      var common: string[] = setA.filter(function(v) {
        return setB.indexOf(v) > -1;
      });
      // console.log('common tags:', common);

      // If at least 2 common tags found, send email
      if (common.length > 1) {
        sendNewsMail(userData.email, userData.displayName, common, job.id);
      }
    }
  });
