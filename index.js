const express = require('express');

const dotenv = require('dotenv');
const Customerror = require('./customerror');

dotenv.config({path:'./config.env'});
const { default: mongoose } = require('mongoose');
require("dotenv").config();
const ControlRouter = require('./Routers/ControlRouter');
const AuthRouter = require('./Routers/authenticaterouter');
mongoose.connect('mongodb://localhost:27017/query-management-system',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((conn)=>{
    console.log('database connected successfully');
}).catch((error)=>{
    console.log('error connecting the database',error);
})
const app = express();
app.use(express.json());
app.use("/api",ControlRouter);
app.use("/auth",AuthRouter);
app.all('*',(req,res,next)=>{
    const error = new Customerror(`the request at ${req.originalUrl} not found on the server`);
    next(error);
})
app.use((error,req,res,next)=>{
    error.statusCode = error.statusCode||500;
    error.status  = error.status || 'error occurred';
    res.status(error.statusCode).json({
        status:error.statusCode,
        message:error.message
    })
})
const PORT = 8500
app.listen(PORT,()=>{
    console.log('server is running on port',PORT);
})
