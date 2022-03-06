const agenda = require('./agendaClient');
const logger = require('../util/winstonLogger');
const redis_client = require('../util/redisClient');
const RecommendationServiceAPI = require('../util/recommendationServiceAPI');
const NewReview = async () => {
  try{
    await agenda.define("NEW_REVIEW", async (job, done) => {
      logger.info("Job: " + job.attrs.name + " is running for userId: " + job.attrs.data.userId);
      const {userId} = job.attrs.data;
      const recommendationServiceAPI = new RecommendationServiceAPI();
      await recommendationServiceAPI.newReview(userId, async (userId) => {
        await redis_client.lpos("new_reviews", userId, async (err,data)=>{
          if(err){
            logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
          }
          if(data != null){
            /**
             * removes occurence of userId
             * from "new_reviews" queue in redis
             * to schedule newReview job for the user
             * in the time interval.
             */
            await redis_client.lrem("new_reviews", 1, userId); 
          }
        })
      })
      logger.info("Job: " + job.attrs.name + " is completed for userId: " + job.attrs.data.userId);
      done();
    })
  } catch(err){
    logger.error(`${err}`);
  }
}
module.exports = {
  NewReview
}