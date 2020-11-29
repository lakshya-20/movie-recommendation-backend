const express = require('express')
const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken');
const {JWT_SECRET}=require('../config/key')
const router = express.Router()

const User = mongoose.model("User")
const movies_data =  mongoose.model("movies_data")
const reviews =  mongoose.model("reviews")

router.post('/signup',(req,res)=>{
    //console.log("signin entered",req.body)
    const {name,email,password,photo,gender}=req.body
    if(!email || !password || !name || !gender){
        res.status(422).json({error:"all entries required"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists with that mail"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                photo,
                gender,
            })
    
            user.save()
            .then(user=>{
                const token=jwt.sign({_id:user._id},JWT_SECRET)
                const {_id,name,email,gender,photo,reviews}=user
                res.json({token,user:{_id,name,email,gender,photo,reviews}})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(422).json({error:"email and password are required"})
    }
    // User.findOne({email:email})
    // .then(savedUser=>{
    //     if(!savedUser){
    //         return res.status(422).json({error:"Invalid username or password"})
    //     }
    //     bcrypt.compare(password,savedUser.password)
    //     .then(doMatch=>{
    //         if(doMatch){
    //             //res.json({message:"Successfully signed in"})
    //             const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
    //             const {_id,name,email,gender,photo,reviews}=savedUser
    //             res.json({token,user:{_id,name,email,gender,photo,reviews}})
    //         }
    //         else{
    //             return res.status(422).json({error:"Invalid password"})
    //         }
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // })
    try{
        const savedUser=(await User.findOne({email:email}))
        if(!savedUser){
            return res.status(422).json({error:"Invalid username or password"})
        }
        savedUser.password=undefined
        var movie_data=[]
        for(var index=0;index<savedUser.reviews.length;index++){
            movie_data.push(await reviews.findOne({_id:savedUser.reviews[index]})
            .populate("refMovieId","movieId title genres poster imdb_link")
            )
        }
        savedUser.reviews=movie_data
        const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
        //res.json(savedUser)
        //const {_id,name,email,gender,photo,reviews}=savedUser
        res.json({token,user:savedUser})
    }catch(err){
        console.log(err.message);
		res.status(500).send('Server Error');
    }
})









module.exports = router