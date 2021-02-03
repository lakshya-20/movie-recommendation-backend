const mongoose = require('mongoose');
const {mongourl}=require('../config/key');

module.exports=async ()=>{
    try{
        await mongoose.connect(mongourl);
        console.log("Mongodb Connected...");
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}