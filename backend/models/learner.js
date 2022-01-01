const mongoose = require('mongoose');
const { Schema } = mongoose;

const learnerSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },
    age:{
        type:String,
        trim:true,
        required:true, 
    },
    address:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    
    area:{
        type:String,
        required:true,
    },
    nid_picture:{
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
        required:true,
    },
    profile_picture:{
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
        required:true,
    },
    
    vechicle_type:{
        type: String, 
        default: 'car'
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
    stripeCustomerId: {
        type: String,
      },
});

module.exports = mongoose.model('lerner', learnerSchema)
