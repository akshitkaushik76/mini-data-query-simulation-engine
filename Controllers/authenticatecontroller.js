const express = require('express');
const User = require('./../models/usermodel');
const jwt = require('jsonwebtoken');
const util = require('util');
const Customerror = require('./../customerror');
const asyncerrorhandler = (func)=>{
    return(req,res,next)=>{
        func(req,res,next).catch((err)=>next(err));
    }
};
const signupToken = (id)=>{
    return jwt.sign({id},process.env.secret_string)
}
console.log("secret string",process.env.secret_string)
exports.Signup = asyncerrorhandler(async(req,res,next)=>{
    
        const data = await User.create(req.body);
        const token = signupToken(data._id);
        res.status(201).json({
            status:'success',
            token,
            data,
        })
    });
    


exports.loginStudent = asyncerrorhandler(async(req,res,next)=>{
        
        const email = req.body.email;
    const password = req.body.password;
    if(!email || !password) {
      return next(new Customerror('please enter email and password',400));
    }
    const user  = await User.findOne({email}).select('+password');
    console.log(user);
    if(!user || !(await user.comparepswdinDB(password,user.password))) {
       return next(new Customerror('either password is wrong or user with password does not exist',400));
    }
    const token = signupToken(user._id);
    res.status(201).json({
        status:'success',
        token,
        user
    })

});

exports.protect = asyncerrorhandler(async(req,res,next)=>{
    const testToken = req.headers.authorization;
    let token;
    if(testToken && testToken.startsWith('Bearer')) {
        token  = testToken.split(' ')[1];
    }
    if(!token) {
      return next(new Customerror('please enter the password to continue',400));
    }
    console.log(token);
    const decodedToken = await util.promisify(jwt.verify)(token,process.env.secret_string);
    console.log(decodedToken);
    const user = await User.findById(decodedToken.id);
    if(!user) {
        return next(new Customerror('the user with token does not exist',400));
    }
    if(await user.ispasswordChanged(decodedToken.iat)) {
        return next(new Customerror('password changed recently please login agian',400));
    }
    req.user = user;
    next();
})
