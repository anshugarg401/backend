const mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const connecttomongo = ()=>{mongoose.connect(mongoURL,()=>{console.log('success fully connected to mongodb');})} 
module.exports = connecttomongo;
