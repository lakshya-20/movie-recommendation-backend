const redis = require('redis');
const logger = require('./winstonLogger');

const port=process.env.REDIS_PORT||6379;
const client = redis.createClient(port);

client.on("connect",()=>{
    logger.info("Redis Client Connected...");
})

client.on("error",(err)=>{
    logger.error(err);
})

module.exports=client;