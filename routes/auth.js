const express = require('express')
const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken');
const {JWT_SECRET}=require('../config/key')
const router = express.Router()
const User = mongoose.model("User")

router.post('/signup',(req,res)=>{
    const {name,email,password,photo,gender,username}=req.body
    if(!email || !password || !name || !gender || !username){
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
                username
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

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(422).json({error:"email and password are required"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid username or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully signed in"})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,gender,photo,reviews}=savedUser
                res.json({token,user:{_id,name,email,gender,photo,reviews}})
            }
            else{
                return res.status(422).json({error:"Invalid password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})









module.exports = router