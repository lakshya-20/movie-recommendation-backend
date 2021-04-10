const express = require('express')
const cors = require('cors');
var path = require('path');
var passport = require('passport');
var mustacheExpress = require('mustache-express');  

const dotenv = require('dotenv')
dotenv.config();

const logger = require('./util/winstonLogger');
const mongoConnection=require('./util/mongoConnection');
mongoConnection();


const app=express()
app.use(express.json())
app.use(cors());
app.use(passport.initialize())

app.engine('html', mustacheExpress()); 
app.set('view engine', 'html'); 
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    logger.info("Rendering Homepage...")
    res.render('index',{
        detail:[
            {name:"api/movies",detail:"Get list of all movies",method:"GET",id:"0"},
            {name:"api/movies/:movieId",detail:"Get details of a movie",method:"GET",id:"1"},
            {name:"api/reviews",detail:"Get list of all movies",method:"GET",id:"2"},
            {name:"api/reviews",detail:"Post new review",method:"POST",id:"3"},
            {name:"api/reviews/:userId",detail:"Get all reviews of a user",method:"GET",id:"4"},
            {name:"api/auth/signup",detail:"Register new user",method:"POST",id:"5"},
            {name:"api/auth/signin",detail:"Logiin an existing user",method:"POST",id:"6"},
            {name:"api/auth/google",detail:"Google OAuth handler",method:"GET",id:"7"},
            {name:"api/auth/google/callback",detail:"Google OAuth callback route",method:"GET",id:"8"},
            {name:"api/auth/oauth/util",detail:"Accepts token and return the user details",method:"POST",id:"9"}
        ]        
    });
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/movies',require('./routes/movies'))
app.use('/api/reviews',require('./routes/reviews'))

const PORT=process.env.PORT ||5000
const server = app.listen(PORT,()=>{    
    logger.info(`Server starting on port no: ${PORT}`)
})

module.exports = server;
