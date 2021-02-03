const express = require('express')
const cors = require('cors');

const mongoConnection=require('./util/mongoConnection');
mongoConnection();


require('./models/user')
require('./models/movie')
require('./models/review')

const app=express()
app.use(express.json())
app.use(cors());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/movies',require('./routes/movies'))
app.use('/api/reviews',require('./routes/reviews'))

const PORT=process.env.PORT ||5000
app.listen(PORT,()=>{
    console.log("Server starting on port no: ",PORT)
})