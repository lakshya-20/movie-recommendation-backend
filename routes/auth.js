const express = require('express')
const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken');
const {JWT_SECRET}=require('../config/key')
const router = express.Router()
const logger = require('../util/winstonLogger')


const {User} = require('../models/user');
const {Review} = require('../models/review');

router.post('/signup',async(req,res)=>{
    const {name,email,password,photo,gender}=req.body
    if(!email || !password || !name || !gender){
        res.status(422).json({error:"all entries required"})
    }

    try{
        const savedUser=(await User.findOne({email:email}))
        if(savedUser){            
            logger.info("User already exists with that mail")
            return res.status(422).json({error:"User already exists with that mail"})
        }
        var user = new User({
            email,
            password,
            name,
            photo,
            gender,
        })
        user.password=await bcrypt.hash(password,12)
        await user.save()
        user=(await User.findOne({email:email}))
        
        user.password=undefined
        var movie_data=[]
        for(var index=0;index<user.reviews.length;index++){
            movie_data.push(await reviews.findOne({_id:user.reviews[index]})
            .populate("refMovieId","movieId title genres poster imdb_link")
            )
        }
        user.reviews=movie_data
        const token=jwt.sign({_id:user._id},JWT_SECRET)
        console.log("Entreres")
        res.json({token,user:user})

    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		res.status(500).send('Server Error');
    }
})

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(422).json({error:"email and password are required"})
    }
    try{
        const savedUser=(await User.findOne({email:email}))
        if(!savedUser){
            logger.info("No user exists with that email")
            return res.status(422).json({error:"Invalid username or password"})
        }
        savedUser.password=undefined
        var movie_data=[]
        for(var index=0;index<savedUser.reviews.length;index++){
            movie_data.push(await Review.findOne({_id:savedUser.reviews[index]})
            .populate("refMovieId","movieId title genres poster imdb_link")
            )
        }
        savedUser.reviews=movie_data
        const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
        res.json({token,user:savedUser})
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		res.status(500).send('Server Error');
    }
})









module.exports = router