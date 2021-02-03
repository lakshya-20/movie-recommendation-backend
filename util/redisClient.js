const redis = require('redis');

const port=process.env.REDIS_PORT||6379;
const client = redis.createClient(port);

client.on("connect",()=>{
    console.log('Redis Client Connected...');
})

client.on("error",(err)=>{
    console.log("Error: "+err);
})

module.exports=client;