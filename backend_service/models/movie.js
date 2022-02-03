const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    movieId:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    imdb_score:{
        type:Number,
        required:true
    },
    genres:{
        type:String,
        required:true
    }
})
exports.Movies_data=mongoose.model("Movies_data",movieSchema)