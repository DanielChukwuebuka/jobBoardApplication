const mongoose = require("mongoose")

const user = new mongoose.Schema({

    firstName : String,
    lastName : String,
    email : String,
    phoneNumber : String,
    password : String,
    isVerified :{
        type: Boolean,
        default: false
    },
    isEmployer:{
        type:Boolean,
        default:false
        
    },
    isJobSeeker:{
        type:Boolean,
        default:false
    },
    token :{
        type: String
    },

},{timestamps: true})

const userModel = mongoose.model("jobFinder", user)

module.exports = userModel