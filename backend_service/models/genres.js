const mongoose = require('mongoose');
const  genreSchema = new mongoose.Schema({
    genre: {
        type: String
    }
})
exports.Genres_list=mongoose.model("genres", genreSchema)