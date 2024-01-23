const express = require ('express')
const route = express.Router()
const { signUp,login,verifyUser,postJobs, getAllJobs,getOneJob,getAllJobsByType } = require("../controller/control")
const authorized = require("../middleware/authorization")

route.post("/signUp", signUp)
route.post("/login", login  )
route.put("/verifyUser/:id/:token", verifyUser)
route.post("/postJobs", authorized,postJobs)
route.get("/getAllJobs", getAllJobs)
route.get("/getOneJob/:id", getOneJob )
route.get("/getAllJobsByType",  getAllJobsByType)

module.exports = route