const mongoose = require('mongoose');
const mongoURL = "mongodb+srv://anshugarg401:Sy3T2nStW4XqY1p7@cluster0.imi0h76.mongodb.net/test"
const connecttomongo = ()=>{mongoose.connect(mongoURL,()=>{console.log('success fully connected to mongodb');})} 
module.exports = connecttomongo;
