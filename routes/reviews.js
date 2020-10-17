const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const User = mongoose.model("User")
const movies_data =  mongoose.model("movies_data")
const reviews =  mongoose.model("reviews")
const requireLogin = require('../middleware/requireLogin')

router.get('/',(req,res)=>{
    reviews.find()
    .populate("movieId","_id title genres rating")
    .then((reviews)=>{
        res.json(reviews)
    }).catch(err=>{
        console.log(err)
    })
    
})

router.post('/',requireLogin,(req,res)=>{
    const {movieId,userId,rating,comment}=req.body
    const review = new reviews({
        movieId,
        userId,
        rating,
        comment
    })
    review.save().then(result=>{
        User.findByIdAndUpdate(userId,{
            $push:{reviews:result._id}
        },{new:true})
        .then(review=>{
            console.log("User"+result)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
        //console.log(req)
        res.json(review)
    })
    .catch(err=>{
        
        return res.status(422).json({error:err})
    })
})

module.exports=router