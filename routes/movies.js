const express = require('express')
const mongoose = require('mongoose')
const sanitize = require('mongo-sanitize');
const requireLogin = require('../util/requireLogin')
//const redisClient=require('../util/redisClient');
const logger=require('../util/winstonLogger');
 
const {Movies_data} =  require('../models/movie');

const router = express.Router()


// @route   Get api/movies
// @desc    Get list of all movies
// @access  Public
router.get('/',async(req,res)=>{    
    try{
        
        // redisClient.get("movies",async (err,data)=>{
            
        //     if(err){
        //         logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        //         res.status(500).send("Server Error");
        //     }
        //     if(data!=null){                                                
        //         res.send(data);
        //     }
        //     else{                
        //         const movies= await Movies_data.find();
        //         redisClient.setex("movies",3600,JSON.stringify(movies));
        //         res.json(movies);
        //     }            
        // })
        const movies= await Movies_data.find();
        res.json(movies);
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send('Server Error');
    }    
})

// @route   Get api/movies/recommendation
// @desc    Get list of 10 movies (dumnmy recommendations)
// @access  Public
router.get('/recommendations',async(req,res)=>{    
    try{        
        const movies= await Movies_data.find().limit(10);
        res.json(movies);
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send('Server Error');
    }    
})

// @route   Get api/movies/:movieId
// @desc    Get details of a movie
// @access  Public
router.get('/:movieId',async (req,res)=>{    
    var movieId=sanitize(req.params.movieId);    
    try{
        movieId=mongoose.Types.ObjectId(movieId);
        const movie= await Movies_data.findById(movieId);
        res.json(movie);
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send("Server Error");
    }
})



module.exports=router