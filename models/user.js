const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        default:"user"
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"https://drive.google.com/uc?id=1a6RhWRlSfZ8sLpyJydE8RCIDjkHsLlDy"
    },
    reviews:[{
        movieId:Number,
        rating:Number
    }]
    
})


mongoose.model("User",userSchema)