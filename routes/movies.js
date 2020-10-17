const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const movies_data =  mongoose.model("movies_data")

router.get('/',(req,res)=>{
    movies_data.find()
    .then((movies)=>{
        res.json({movies})
    }).catch(err=>{
        console.log(err)
    })
    
})


module.exports=router