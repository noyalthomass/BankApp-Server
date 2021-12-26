//import mongoose

const mongoose=require('mongoose')

//connect server and mongodb

mongoose.connect('mongodb://localhost:27017/bankapp',{
    useNewUrlParser:true
})

//model creation

const User=mongoose.model('User',{
    accno:Number,
     uname:String,
     password:String, 
     balance:Number,
     transaction:[]
})

//export model

module.exports={
    User
}