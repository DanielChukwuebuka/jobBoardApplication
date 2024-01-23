const express = require ('express')
const route = express.Router()
const { signUp,login,verifyUser,getAllJobs, postJobs,remoteJobs,onSiteJobs,hybridJobs, }= require("../controller/control")
const authorized = require("../middleware/authorization")

route.post("/signUp", signUp)
route.post("/login", login  )
route.put("/verifyUser/:id/:token", verifyUser)
route.post("/postJobs", authorized,postJobs)
route.get("/getAllJobs", getAllJobs)
// route.get("/getOneJob/:", getOneJob )
route.get("/remoteJobs/:category", remoteJobs)
route.get("/onSiteJobs/:category", onSiteJobs)
route.get("/hybridJobs/:category", hybridJobs)

module.exports = route