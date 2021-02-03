const express = require('express')
const cors = require('cors');
const logger = require('morgan');

const mongoConnection=require('./util/mongoConnection');
mongoConnection();
const redisClient=require('./util/redisClient');

require('./models/user')
require('./models/movie')
require('./models/review')

const app=express()
app.use(express.json())
app.use(cors());

const NODE_ENV=process.env.NODE_ENV;
if(NODE_ENV==="development"){
    app.use(logger('dev'));
}

app.use('/api/auth',require('./routes/auth'))
app.use('/api/movies',require('./routes/movies'))
app.use('/api/reviews',require('./routes/reviews'))

const PORT=process.env.PORT ||5000
app.listen(PORT,()=>{
    console.log("Server starting on port no: ",PORT)
})