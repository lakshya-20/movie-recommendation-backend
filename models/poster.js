const mongoose = require('mongoose');
const posterSchema = new mongoose.Schema({
    movieId:{
        type:Number,
        required:true
    },
    poster:{
        type:String,
        required:true
    },
    imdb_link:{
        type:String,
        required:true
    }
})
mongoose.model("posters_data",posterSchema)