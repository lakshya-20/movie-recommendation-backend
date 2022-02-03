const redis = require('redis');
const logger = require('./winstonLogger');

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on("connect",()=>{
    logger.info("Redis Client Connected...");
})

client.on("error",(err)=>{
    logger.error(""+err);
})

module.exports=client;
