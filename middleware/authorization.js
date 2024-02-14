const jwt = require("jsonwebtoken")
const userModel = require("../onboardModel/model")
const authorized = async (req, res, next)=>{
try {
let token;

if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
){
    token = req.headers.authorization.split(" ")[1]
}

if(!token){
return res.status(404).json({
    message: "authorization token is required"
})
}

    const decodeToken = jwt.verify(token, process.env.secret)
console.log("Token:  "+decodeToken)
    const user = await userModel.findById(decodeToken.userId)
    console.log("user: "+user)
if(!user){
    return res.status(404).json({
        message:"user not found"
    })
}
if(user.blacklist.includes(token)){
    return res.status(400).json({
        message: "authorization failed : please login again"
    })
}


req.user = user
    next()

 
} catch (error) {
    if(error instanceof jwt.JsonWebTokenError){
    return res.status(500).json({
        message: "session timeout, please login again"
    })
    return res.status(500).json({
        message: " error authenticating " + error.message
    })

}
}

}


module.exports = authorized