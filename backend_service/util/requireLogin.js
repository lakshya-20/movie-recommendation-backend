const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports = async (req,res,next)=>{
    const {authorization} = req.headers
    const token = authorization
    if(!token){
        return res.status(401).json({error:"Access denied. No token provided."})    
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        req.user=user;
        next();
    }catch(err){
        res.status(400).send("Invalid token");
    }
}