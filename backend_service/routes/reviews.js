const express = require('express');
const mongoose = require('mongoose')
const { v4: uuidV4 } = require('uuid');
const sanitize = require('mongo-sanitize');
const requireLogin = require('../util/requireLogin');
const logger=require('../util/winstonLogger');
const redis_client = require('../util/redisClient');
const {User} = require('../models/user');
const {Review} =  require('../models/review');

const router = express.Router()

router.get('/',async (req,res)=>{

    try{
        const reviews = await Review.find();
        res.json(reviews);
    }catch(err){        
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send("Server Error");
    }
})

router.post('/',requireLogin,async(req,res)=>{
    try{
        const {movieId,userId,rating,comment,refMovieId}=req.body
        const review = new Review({
            movieId,
            userId,
            rating,
            comment,
            refMovieId
        })
        review.rid = uuidV4()
        const result = await review.save()
        await User.findByIdAndUpdate(userId,{
            $push:{reviews:result._id}
        },{new:true});
        /**
         * maintaning "new_reviews" queue in redis
         * to async. call newReviews(uid) in
         * recommendation microservice.
         */
        redis_client.lpos("new_reviews", userId, async(err,data)=>{
            if(err){
                logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            }
            if(data == null){
                await redis_client.rpush("new_reviews", userId);
            }
        })        
        res.json({newReview:result});
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send("Server Error");
    }
    
})

router.get('/:userId',async (req,res)=>{

    try{
        const reviews = await Review.find({userId:req.params.userId}).populate("refMovieId","movieId title genres poster imdb_link")
        res.json(reviews);
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send("Server Error");
    }
    // try{
    //     const userId=sanitize(req.params.userId);
    //     const reviews=await Review.find({userId:userId}).populate("refMovieId","movieId title genres poster imdb_link")
    //     res.json(reviews);
    // }catch(err){
    //     logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    //     res.status(500).send("Server Error");
    // }
})
module.exports=router