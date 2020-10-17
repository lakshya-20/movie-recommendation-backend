const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const reviewSchema = new mongoose.Schema({
    rid: {
		type: String,
		required: true,
		unique: true
	},
    refMovieId:{
        type:ObjectId,
        ref:"movies_data"
    },
    movieId:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    comment:{
        type:String
    }
})
mongoose.model("reviews",reviewSchema)