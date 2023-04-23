const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
    id :{type:String,required:true},
    mobileName:{type:String,required:true},
    image:{type:String,required:true},
    model:{type:String,required:true},
    price:{type:String,required:true},
    Ram:{type:String,required:true},
    storage:{type:String,required:true},
    createedAt:{type:String,default:Date.now},
    
  },
  {
    collection:'mobile',
 }

  );

  let mobileModel = mongoose.model('mobile',mobileSchema)
  module.exports={mobileModel}