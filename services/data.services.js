const req = require('express/lib/request');
const jwt=require('jsonwebtoken')
const db=require('./db')
database = {
    1000: { accno: 1000, uname: 'neer', password: 1000, balance: 56666,transaction:[] },
    1001: { accno: 1001, uname: 'amal', password: 1001, balance: 56666,transaction:[] },
    1002: { accno: 1002, uname: 'jay', password: 1002, balance: 56666,transaction:[] },
  };

  const register=(accno, uname, password)=> {
    // let database = this.data;

    
      return db.User.findOne({accno})
      .then(user=>{
        if(user){
          return{
            status:false,
            statuscode:401,
            message:"user already exist"
          }
        }
        else {
          const newuser=new db.User({
            accno,
            uname,
            password,
            balance: 0,
            transaction:[]
          })
          newuser.save()
          return{
            staus:true,
        statuscode:200,
        message:"Account created successfully"
      }
    }   
      })
  }
  
  const login=(accno, password)=> {

    return db.User.findOne({accno,password})
    .then(user=>{
      if(user){
        currentUser=user.uname

        //token generation
        const token=jwt.sign({
          currentAcno:accno
        },'supersecretkey123456')

        return {
          staus:true,
      statuscode:200,
      message:"Log in Successfull",
      currentUser:currentUser,
      currentAcno:accno,
      token
    }
      }
      else {
        
        return {
          staus:false,
      statuscode:401,
      message:"Invalid Password or Account number"
    }
      }
    }) 
      } 
    
 const deposit=(accno, password, amt)=> {
    var amount = parseInt(amt);
   
    return db.User.findOne({accno,password})
    .then(user=>{
      if(!user){
        return {
          staus:false,
      statuscode:401,
      message:"Invalid Password or Account number"
        }
      }
      else{
        user.balance+=amount
        user.transaction.push({
          amount:amount,
          type:"CREDIT"
        })
        user.save()
        return {
          staus:true,
      statuscode:200,
      message:amount+"Deposited succesfully now your current balance is"+user.balance
    } 
      }
    })

  }
  const withdraw=(req,accno, password, amt)=> {
    var amount = parseInt(amt);

    return db.User.findOne({accno,password})
    .then(user=>{
      if(req.currentAcno !=accno){
        return {
          status:false,
          statuscode:401,
          message:"Operation denied"
        }
      }
      if(!user){
        return {
          staus:false,
      statuscode:401,
      message:"Invalid Password or Account number"
        }
      }
      if(user.balance<amount){
        return{
          staus:false,
        statuscode:401,
        message:"Insuffient Balance"
        }
      }
    
        user.balance-=amount
        user.transaction.push({
          amount:amount,
          type:"DEBIT"
        })
        user.save()
        return {
          staus:true,
      statuscode:200,
      message:amount+"Withdraw succesfully now your current balance is "+user.balance
    } 
      
    })
  }
  const getTransaction=(accno)=>{

    return db.User.findOne({accno})
    .then(user=>{
      if(!user){
        return {
          staus:false,
      statuscode:401,
      message:"User does not exit"
    }
      }
      return{

        staus:true,
        statuscode:200,
      transaction:user.transaction
    }
    })

  }
  module.exports={
      register,
      login,
      deposit,
      withdraw,
      getTransaction
  }