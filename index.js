//import express
const express=require('express')
const dataService=require('./services/data.services')
const session=require('express-session')
const { request } = require('express')
const jwt=require('jsonwebtoken')
const cors=require('cors')
//create app using express
const app = express()

//use cors
app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))
//use session
app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:false
}))

//json parse
app.use(express.json())

//application specific middleware
app.use((req,res,next)=>{
    console.log("Application specific middleware")
    next()
})

//router specific middleware
const logMiddleware=(req,res,next)=>{
    if(!req.session.currentAcno){
        res.json({
          status:false,
          statuscode:401,
          message:"Please Log In"
        })
      }
      else{
          next()
      }
}

//jwt middleware
const jwtMiddleware=(req,res,next)=>{
    try{
        const token=req.headers["x-access-token"]
        //token validation
        const data=jwt.verify(token,'supersecretkey123456')
        req.currentAcno=data.currentAcno
        next()
    }
    catch{
        res.json({
            status:false,
            statuscode:401,
            message:"Please Log In"
          })
    }
}

//token API for testing
app.post('/token',jwtMiddleware,(req,res)=>{
    res.send("current account number is:"+req.currentAcno)
})
//define default router
app.get('/',(req,res)=>{
    res.status(401).send("Get method")
})
//http methodil get nu matram anu browseril view ullath

//using post no view in browser
app.post('/',(req,res)=>{
    res.send("Post method")
})

app.post('/register',(req,res)=>{
    dataService.register(req.body.accno, req.body.uname,req.body.password)
    .then(result=>{res.status(result.statuscode).send(result)})
    
})

app.post('/login',(req,res)=>{
    dataService.login(req.body.accno,req.body.pwd)
    .then(result=>{res.status(result.statuscode).send(result)})

})
app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.accno,req.body.pwd,req.body.amount)
    .then(result=>{res.status(result.statuscode).send(result)})
    
})
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataService.withdraw(req,req.body.accno,req.body.pwd,req.body.amount)
    .then(result=>{res.status(result.statuscode).send(result)})
    
})
app.post('/getTransaction',jwtMiddleware,(req,res)=>{
    dataService.getTransaction(req.body.accno)
    .then(result=>{res.status(result.statuscode).send(result)})

})


//set port
app.listen(3000,()=>{
    console.log("server started at port umber 3000");
})
