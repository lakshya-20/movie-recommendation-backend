const express = require('express')
const mongoose = require('mongoose')


const {mongourl}=require('./config/key');
var connect=mongoose.connect(mongourl);
connect.then((db) =>{
  console.log('Connected correctly to mongodb');
},(err)=>{console.log(err)});


require('./models/user')
require('./models/movies')
require('./models/poster')


const app=express()
app.use(express.json())

const PORT=process.env.PORT ||5000
app.listen(PORT,()=>{
    console.log("Server starting on port no: ",PORT)
})