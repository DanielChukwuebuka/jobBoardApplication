const express = require ('express')
const route = express.Router()
const { signUpEmployer,signUpJobSeeker,login,verifyUser,getAllJobs,
    getOneJob, postJobs,getAllRemoteJobs,getAllOnsiteJobs,partTimeJob,fullTimeJobs }= require("../controller/control")
const authorized = require("../middleware/authorization")

route.post("/signUpEmployer", signUpEmployer),
route.post("/signUpJobSeeker", signUpJobSeeker)
route.post("/login", login  )
route.put("/verifyUser/:id/:token", verifyUser)
// route.post("/postJobs", authorized,postJobs)
route.get("/getAllJobs", getAllJobs)
route.get("/getOneJob/:id", getOneJob )
route.get("/getAllRemoteJobs", getAllRemoteJobs)
route.get("/getAllOnsiteJobs", getAllOnsiteJobs)
route.get("/partTimeJob", partTimeJob)
route.get("/fullTimeJobs", fullTimeJobs)



// route.post("/postjobs"),(authorized,postJobs)

module.exports = route