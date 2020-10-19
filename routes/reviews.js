const express = require('express')
const mongoose = require('mongoose')
const { v4: uuidV4 } = require('uuid');


const router = express.Router()
const User = mongoose.model("User")
const movies_data =  mongoose.model("movies_data")
const reviews =  mongoose.model("reviews")
const requireLogin = require('../middleware/requireLogin')

router.get('/',(req,res)=>{
    reviews.find()
    .populate("refMovieId","_id title genres rating")
    .then((reviews)=>{
        res.json(reviews)
    }).catch(err=>{
        console.log(err)
    })
    
})

router.post('/',requireLogin,async(req,res)=>{
    const {movieId,userId,rating,comment,refMovieId}=req.body
    const review = new reviews({
        movieId,
        userId,
        rating,
        comment,
        refMovieId
    })
    review.rid = uuidV4()
    review.save().then(result=>{
        User.findByIdAndUpdate(userId,{
            $push:{reviews:result._id}
        },{new:true})
        .then(async review=>{
            //console.log("User"+result)
            try{
                const savedUser=(await User.findById(userId))
                if(!savedUser){
                    //return res.status(422).json({error:"Invalid username or password"})
                }
                savedUser.password=undefined
                var movie_data=[]
                for(var index=0;index<savedUser.reviews.length;index++){
                    movie_data.push(await reviews.findOne({_id:savedUser.reviews[index]})
                    .populate("refMovieId","movieId title genres poster imdb_link")
                    )
                }
                savedUser.reviews=movie_data
                res.json({user:savedUser})
            }catch(err){
                console.log(err.message);
                res.status(500).send('Server Error');
            }
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
    
})

module.exports=router