const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        default:"user"
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    gender:{
        type:String,
    },
    photo:{
        type:String,
        default:"https://drive.google.com/uc?id=1a6RhWRlSfZ8sLpyJydE8RCIDjkHsLlDy"
    },
    provider:{
        type:String,
        default:"user"
    },
    reviews:[{
        type:ObjectId,
        ref:"Reviews"
    }]
    
})


exports.User=mongoose.model("User",userSchema)