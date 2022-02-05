const express = require('express')
const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken');
var passport = require('passport');

const router = express.Router()
const logger = require('../util/winstonLogger')


const {User} = require('../models/user');
const {Review} = require('../models/review');
require('../util/passport');

router.post('/signup',async(req,res)=>{
    const {name,email,password,photo,gender}=req.body
    if(!email || !password || !name || !gender){
        res.status(422).json({error:"all entries required"})
    }

    try{
        const savedUser=(await User.findOne({email:email}))
        if(savedUser){            
            if(savedUser.provider==="google"){
                logger.info("This email address is already being used with a Google account")
                return res.status(422).json({error:"This email address is already being used with a Google account"})    
            }
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
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
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
        if(!savedUser.password){
            if(savedUser.provider==="google"){
                logger.info("This email address is already being used with a Google account")
                return res.status(400).json({ msg: 'Try logging with google account.' });    
            }
            logger.info("Invalid credentials");
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, savedUser.password);

		if (!isMatch) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}

        savedUser.password=undefined
        var movie_data=[]
        for(var index=0;index<savedUser.reviews.length;index++){
            movie_data.push(await Review.findOne({_id:savedUser.reviews[index]})
            .populate("refMovieId","movieId title genres poster imdb_link")
            )
        }
        savedUser.reviews=movie_data
        const token=jwt.sign({_id:savedUser._id}, process.env.JWT_SECRET)
        res.json({token,user:savedUser})
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		res.status(500).send('Server Error');
    }
})


router.get('/google', passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/signin',session:false}), async (req,res) =>{
    //console.log("Redirect url called");
    let user = {        
        name: req.user._json.name,
        email: req.user._json.email,
        photo: req.user._json.picture,
        provider: req.user.provider 
    }

    let savedUser = await User.findOne({email:user.email})
    if(!savedUser){
        logger.info("New user created with google signin");
        savedUser = new User(user);
        savedUser = await savedUser.save();
    }

    const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
    res.redirect(`${process.env.FRONTEND_URL}/?token=`+token);
})

router.post('/oauth/util',async (req,res)=>{
    try{
        const {authorization} = req.headers
        const token = authorization
        if(!token){
            return res.status(401).json({error:"Access denied. No token provided."})    
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded._id);
        res.json({token,user:user})
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		res.status(500).send('Server Error');
    }

    
})

module.exports = router