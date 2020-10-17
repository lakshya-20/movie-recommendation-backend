const express = require('express')
const mongoose = require('mongoose')

const app=express()
const PORT=process.env.PORT ||5000

app.use(express.json())
app.listen(PORT,()=>{
    console.log("Server starting on port no: ",PORT)
})