const mongoose = require("mongoose")

const user = new mongoose.Schema({

    firstName : { 
        type:String,
        required: [true, "firstName is required"]

    },
    lastName : { 
        type:String,
        required: [true, "lastName is required"]

    },
    email :{ 
        type:String,
        required: [true, "email is required"]

    },
    phoneNumber :{ 
        type:String,
        required: [true, "phonenumber is required"]

    },
    password : { 
        type:String,
        required: [true, "password is required"]

    },
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