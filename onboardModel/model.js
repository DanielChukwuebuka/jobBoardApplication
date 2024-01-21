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
    
    role:{
type: String,
required: true ,
enum:{ 
values:[ "employer", "jobSeeker"], 
message:"role can only be employer or jobseeker"
}
    },
},{timestamps: true})

const userModel = mongoose.model("jobFinder", user)

module.exports = userModel