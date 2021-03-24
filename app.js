const express = require('express')
const cors = require('cors');
var path = require('path');
var mustacheExpress = require('mustache-express');  

const logger = require('./util/winstonLogger');
const mongoConnection=require('./util/mongoConnection');
mongoConnection();


const app=express()
app.use(express.json())
app.use(cors());


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
            {name:"api/reviews/:userId",detail:"Get all reviews of a user",method:"Get",id:"4"},
        ]        
    });
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/movies',require('./routes/movies'))
app.use('/api/reviews',require('./routes/reviews'))

const PORT=process.env.PORT ||5000
app.listen(PORT,()=>{    
    logger.info(`Server starting on port no: ${PORT}`)
})