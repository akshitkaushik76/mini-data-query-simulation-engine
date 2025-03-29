const express = require('express');
const ControlRouter = require('./Routers/ControlRouter');
require("dotenv").config();
const app = express();
app.use(express.json());
app.use("/api",ControlRouter);
const PORT = 8500
app.listen(PORT,()=>{
    console.log('server is running on port',PORT);
})
