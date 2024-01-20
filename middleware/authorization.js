const jwt = require("jsonwebtoken")

const authorized = async (req, res, next)=>{
try {
const authorization = req.headers.authorization;


if(!authorization){
res.status(404).json({
    message: "youre  not authorised"
})
}

const token = authorization.split(" ")[1]
if(!token){
res.status(401).json({
message:"invalid token"

})


}
    const decodeToken = jwt.verify(token, process.env.secret)

    const user = await userModel.findById(decodeToken.userId)
if(!user){
res.status(404).json({
    message:"user not found"
})

}

req.user = decodeToken

    next()


} catch (error) {
    res.status(500).json({
        message: error.message
    })
}

}


module.exports = {authorized}