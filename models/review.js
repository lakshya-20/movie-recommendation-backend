const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const reviewSchema = new mongoose.Schema({
    movieId:{
        type:ObjectId,
        ref:"movies_data"
    },
    rating:{
        type:Number,
        required:true
    },
    userId:{
        type:ObjectId,
        ref:"User"
    },
    comment:{
        type:String
    }
})
mongoose.model("reviews",reviewSchema)