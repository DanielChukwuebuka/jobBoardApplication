const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    Title:String,
  Description:String,
  Stringalary:String,
  CompanyName:String,
  CompanyAddress:String
    

},{timestamps: true})

const jobModel = mongoose.model("jobFinder2", jobSchema)

module.exports = jobModel