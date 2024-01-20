const hapijoi = require("@hapi/joi")

const  validateSignUP = (data)=>{

    const validate = hapijoi.object({
    
        firstName : hapijoi.string().empty("").min(10).max(40).trim().required().messages({
            "string.empty" :"field cant be left empty",
            "string.min" :"minimum of 10  characters"}),

        lastName : hapijoi.string().empty("").trim().min(10).max(40).required().messages({
    "string.empty" :"field cant be left empty",
    "string.min" :"minimum is 10 characters"}),

        email : hapijoi.string().email({tlds: {allow: false}}).trim().empty('').required().messages({
    "string.empty" :"field cant be left empty",
    }),

        phoneNumber : hapijoi.string().required().empty('').min(11).max(15).trim().messages({
    "string.empty" :"field cant be left empty",
    }),

//         password : hapijoi.string().required().empty('').min(10).pattern(new RegExp('^[a-zA-zo-9*#]{3,30}$')).messages({
//     "string.empty" :"field cant be left empty",
//     "string.min ":"min is 5 characters",

// }),

password : hapijoi.string().required().empty('').min(8).max(30).trim().messages({
    "string.empty" :"field cant be left empty",
    "string.min ":"minimum is 5 characters",
    
}),

    //     role :  hapijoi.string().min(8).valid('employer', 'jobseeker').required().empty('').trim().messages({
    //         "string.empty" :"field cant be left empty",})
        
    })
    
    return validate.validate(data)
    }
    
    
    
    const validateSignIn = (data)=>{
        const validateSign = hapijoi.object({
            email : hapijoi.string().email({tlds: {allow: false}}).required().empty('').trim().messages({
                "string.empty" :"field cant be left empty",
                }), 
            
            password : hapijoi.string().required().empty('').min(10).max(30).trim().messages({
                "string.empty" :"field cant be left empty",
                "string.min":"minimum of 10 characters" 
                }),
        })
    
        return validateSign.validate(data)
    }
    
    
    module.exports = {validateSignUP,
        validateSignIn
    }