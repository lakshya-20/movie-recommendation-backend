const express = require('express')
const mongoose = require('mongoose')
const sanitize = require('mongo-sanitize');
const requireLogin = require('../util/requireLogin')

const User = mongoose.model("User")
const Reviews =  mongoose.model("Reviews")
const Movies_data =  mongoose.model("Movies_data")

const router = express.Router()


// @route   Get api/movies
// @desc    Get list of all movies
// @access  Public
router.get('/',async (req,res)=>{    
    try{
        const movies= await Movies_data.find();
        res.json(movies);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }    
})

// @route   Get api/movies/:movieId
// @desc    Get details of a movie
// @access  Public
router.get('/:movieId',async (req,res)=>{
    const movieId=sanitize(req.params.movieId);    
    try{
        const movie= await Movies_data.findById(movieId);
        res.json(movie);
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
})

module.exports=router