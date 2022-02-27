const moment = require('moment');
const logger = require('../util/winstonLogger');
const { NewReview } = require('./ReviewJobs');
const agenda = require('./agendaClient');

agenda.on("ready", (job) => {
  agenda.define("TESTING", {
    priority: 'high',
    concurrency: 1,
  }, (job, done) => {
    console.log("Job running at: " + moment().format());
    logger.info("Job: " + job.attrs.name + " is running...");
    done();
  });
  NewReview();
  agenda.start();
});

agenda.on("fail", (err, job) => {
  if (isErrorTemporary(err)) { // if error is temporary, re-run job later
    logger.error("Error in agenda job");
    job.schedule(moment().add(30000, "milliseconds").toDate()); // reschedule the job after 30 seconds
    job.save();
  }
})

const graceful = async () => {
  await agenda.stop();
  process.exit(0);
}
process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
module.exports = agenda;