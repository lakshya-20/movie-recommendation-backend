const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const User = mongoose.model("User")
const movies_data =  mongoose.model("movies_data")
const reviews =  mongoose.model("reviews")

router.get('/',(req,res)=>{
    movies_data.find()
    .then((movies)=>{
        res.json(movies)
    }).catch(err=>{
        console.log(err)
    })
    
})

router.get('/mypost',async (req,res)=>{
    // User.findById(req.body.userId)
    // // .populate("reviews","_id movieId rating comment")
    // // .populate("reviews.movieId","_id title")
    // .then(result=>{
        
    //     var review_data=[]
    //     for(var index=0;index<result.reviews.length;index++){
    //         // reviews.findOne({_id:result.reviews[index]})
    //         // .populate("movieId","_id title genres rating")
    //         // .then((review)=>{
    //         //     console.log("review"+review)
    //         //     review_data.push(review)
    //         // }).catch(err=>{
    //         //     console.log(err)
    //         // })
    //         //review_data.push(await reviews.findOne({_id:result.reviews[index]}))
    //     }
    //     console.log(review_data)
    //     //res.json({review_data})
    //     res.json({result})
    // })
    // .catch(err=>{
    //     console.log(err)
    // })
    try{
        const reviews_data=(await User.findOne({_id:req.body.userId}))
        reviews_data.password=undefined
        var movie_data=[]
        for(var index=0;index<reviews_data.reviews.length;index++){
            movie_data.push(await reviews.findOne({_id:reviews_data.reviews[index]})
            .populate("movieId","movieId title genres poster imdb_link")
            )
        }
        reviews_data.reviews=movie_data
        res.json(reviews_data)
    }catch(err){
        console.log(err.message);
		res.status(500).send('Server Error');
    }

})

module.exports=router