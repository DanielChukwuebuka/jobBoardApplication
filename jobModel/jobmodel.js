const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  jobDescription: String,
  CompanyName:String,
  CompanyAddress:String,
  Salary:String,
  jobType:
    {
      type: String,
      required: true ,
      enum:{ 
      values:[ "remoteJobs", "hybridJobs", "onSiteJobs"],
      message:"job type can only be remote, hybrid and onsite jobs" 

  }}
    
},{timestamps: true})

const jobModel = mongoose.model("jobFinder2", jobSchema)

module.exports = jobModel