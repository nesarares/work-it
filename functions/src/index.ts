import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { emailingKeys } from 'functions/emailingKeys';

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
 *
 * @param userEmail
 * @param commonTags
 * @param jobId
 */
function sendNewsMail(userEmail, commonTags, jobId) {
  const mailOptions = {
    from: `workit.235@gmail.com`,
    to: userEmail,
    subject: `We found some jobs that you might like.`,
    text: `Hello, a job was found with the following tags :${commonTags.toString()}. 
      https://work-it.ml/jobs/${jobId}`
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
      console.log(user.data());
      console.log('user tags:', user.data().userProfile.tags);
      if (user.data().userProfile.tags === undefined) {
        continue;
      }
      var setA = Array.from(new Set(job.tags));
      var setB = Array.from(new Set(user.data().userProfile.tags));
      var common = setA.filter(function(v) {
        return setB.indexOf(v) > -1;
      });
      console.log('common tags:', common);

      // If at least 2 common tags found, send email
      if (common.length > 1) {
        sendNewsMail(user.data().email, common, job.id);
      }
    }
  });
