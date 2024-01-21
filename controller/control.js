const userModel = require("../onboardModel/model")
// const {validateSignUP, validateSignIn }= require("../helpers/validation")
const jobModel = require("../jobModel/jobmodel")
const bcrypt = require("bcrypt")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const {generateDynamicEmail}= require("../jobhtml")
const sendMail = require("../jobmailer")




const signUpEmployer = async ( req, res)=>{

    try {

    
const {firstName,lastName,phoneNumber, email,password } = req.body
if(!firstName||!lastName||!phoneNumber||!email
    ||!password){
        return res.status(400).json({
            message:"fields cannot be left empty"
        })
    }else if(phoneNumber.length<11){
        return res.status(400).json({
            message:"phone number too short"
        })

    }const checkMail = await userModel.findOne({email:email})
    if(checkMail){
        return res.status(400).json({
            message:"this email is associated with an account"
        })
    }


const salt = bcrypt.genSaltSync(12)
const hashedPassword = bcrypt.hashSync(password, salt)

const token= await jwt.sign({firstName,lastName,email},process.env.secret,{expiresIn:"1 day"})


    

const user = await new userModel({

    firstName,
    lastName,
    phoneNumber,
     email:email.toLowerCase(),
     password : hashedPassword,
    //  picture:[{
    

    //  }]
})

if(!user){
    return res.status(404).json({
        message: "cannot create "
    })
 }


user.token=token

await user.save()

const subject = "Kindly verify"
await jwt.verify(token, process.env.secret)
const link =  (`${req.protocol}://${req.get('host')}/verify/${user.id}/${user.token}`, user.firstName, user.lastName)
const html = generateDynamicEmail(firstName, lastName, link)
message:"welcome on board"


     sendMail(
        {
            email:user.email,
            html:html,
            subject,
            message:link
        }
     )
    
    
        res.status(201).json({
            message: "Welcome, User created successfully",
            data:user
        })
            return;
}    
    
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const signUpJobSeeker = async ( req, res)=>{

    try {

    
const {firstName,lastName,phoneNumber, email,password } = req.body
if(!firstName||!lastName||!phoneNumber||!email
    ||!password){
        return res.status(400).json({
            message:"fields cannot be left empty"
        })
    }else if(phoneNumber.length<11){
        return res.status(400).json({
            message:"phone number too short"
        })

    }const checkMail = await userModel.findOne({email:email})
    if(checkMail){
        return res.status(400).json({
            message:"this email is associated with an account"
        })
    }


const salt = bcrypt.genSaltSync(12)
const hashedPassword = bcrypt.hashSync(password, salt)

const token= await jwt.sign({firstName,lastName,email},process.env.secret,{expiresIn:"1 day"})


    

const user = await new userModel({

    firstName,
    lastName,
    phoneNumber,
     email:email.toLowerCase(),
     password : hashedPassword,
    //  picture:[{
    

    //  }]
})

if(!user){
    return res.status(404).json({
        message: "cannot create "
    })
 }


user.token=token

await user.save()

// const subject = "Kindly verify"
// await jwt.verify(token, process.env.secret)
// const link =  (`${req.protocol}://${req.get('host')}/verify/${user.id}/${user.token}`, user.firstName, user.lastName)
// const html = generateDynamicEmail(firstName, lastName, link)
// message:"welcome on board"


//      sendMail(
//         {
//             email:user.email,
//             html:html,
//             subject,
//             message:link
//         }
//      )
    
    
        res.status(201).json({
            message: "Welcome, User created successfully",
            data:user
        })
            return;
}    
    
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}


const verifyUser = async(req,res)=>{
    try {
    const id =req.params.id
    const registeredUser = await userModel.findById(id)
    const registeredToken= registeredUser.token
    await jwt.verify(registeredToken,process.env.secret,(err,data)=>{
    if(err){
    return res.status(300).json({
    message:"this link has expired"
    })
}else{

    return data
    }
    })
    const verified =await userModel.findByIdAndUpdate(req.params.id,{isVerified:true},)
    if(!verified){
    return res.status(400).json({
    message:"unable to verify user"
    })
    }else{
    return res.status(200).json({
    message:`${registeredUser.firstName} your account have been verified successfully`
    })
    }
    
    } catch (error) {
    return res.status(500).json({
    message:error.message
    })
    
    
    }
    }
    

const login =  async (req,res) =>{
    try{

        // const {error} = await validateSignIn(req.body)
        // if(error){
        //     res.status(500).json({
        //         message: error.details[0].message
        //     })
        // }
        // else{

            const {email, password} = req.body

      const userExists = await userModel.findOne({ email: email.toLowerCase() });
    
      if(!userExists){
          return res.status(404).json({
              message: "user not found"
          })
         
      }
          
        
     const checkPassword = bcrypt.compareSync(password, userExists.password)
        if (!checkPassword) {
          return res.status(401).json({
              message: "incorrect password"
          })
    
  
      }
      const token = jwt.sign({
        userId:userExists._id,
        firstName:userExists.firstName,
        lastName:userExists.lastName,
        email:userExists.email.toLowerCase(),

      }, process.env.secret,{expiresIn: "2min"})
  
  
      res.status(200).json({
          message :`Login successful, welcome ${userExists.firstName}`,
          token
          
      })

        


    }

catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}





const postJobs= async (req,res)=>{
    try {
     const {Title,Description,Salary,CompanyName,CompanyAddress}=req.body
     const postJob = await jobModel.create(req.body)
     if(!postJob){
         return res.status(400).json({
             message:"cannot create this job"
         })
     
     }else{
         return res.status(201).json({
             message:"job created ",
             data:createJob
         })
 
     }
        
     
    } catch (error) {
     return res.status(500).json({
         message:error.message
     })
     
    }
     }
 
 const getAllJobs=async(req,res)=>{
         try {
             const getAllJobs = await jobModel.find()
             if(getAllJobs.length===0){
                 return res.status(404).json({
                     message:"No jobs available"
                 })
             }else{
                 return res .status(200).json({
                   message:"Here are all the jobs available",
                   data:getAllJobs.length()
                 })
             }
         } catch (error) {
             return res.status(500).json({
                 message:error.message
             })
             
         }
     }
 
 
 const getOneJob =async(req,res)=>{
         try {
             const id =req.params.id
             const job = await jobModel.findById(id)
             if(!job){
                 return res.status(404).json({
                     message:`job with id ${id} not found`
                 })
             }else{
                 return res.status(200).json({
                     message:`Here is the job with id ${id}`,
                     data:job
                 })
             }
         } catch (error) {
             return res.status(500).json({
                 message:error.message
             })
             
         }
     }
     const getAllRemoteJobs = async()=>{
        try {
            const remoteJobs= await jobModel.find({Description:remoteJobs})
            if(!remoteJobs){
                return res.status(404).json({
                    message:"no remote jobs available"
                })
            }else{
                return res.status(200).json({
                    message:"here are all remote jobs",
                    data:remoteJobs.length
                })
            }
            
        } catch (error) {
            return res.status(500).json({
                message:error.message
            })
            
        }
     }


     const getAllOnsiteJobs = async(req,res)=>{
        try {
            const onSiteJob= await jobModel.find({Description:onSite})
            if(!onSiteJob){
                return res.status(404).json({
                    message:"no on site jobs available"
                })
            }else{
                return res.status(200).json({
                    message:"here are all on site jobs",
                    data:onSiteJob.length
                })
            }
            
        } catch (error) {
            return res.status(500).json({
                message:error.message
            })
            
        }
        
     }
     const partTimeJob = async(req,res)=>{
 
            try {
                const partTimeJob= await jobModel.find({Description:partTimeJob})
                if(!onSiteJob){
                    return res.status(404).json({
                        message:"no  part time jobs available"
                    })
                }else{
                    return res.status(200).json({
                        message:"here are all part time jobs",
                        data:partTimeJob.length
                    })
                }
                
            } catch (error) {
                return res.status(500).json({
                    message:error.message
                })
                
            }
            
       
     }
    

     const fullTimeJobs= async(req,res)=>{
        try {
            const fullTimeJob= await jobModel.find({Description:fullTimeJob})
            if(!fullTimeJob){
                return res.status(404).json({
                    message:"no  full time jobs available"
                })
            }else{
                return res.status(200).json({
                    message:"here are all part time jobs",
                    data:fullTimeJob.length
                })
            }
            
        } catch (error) {
            return res.status(500).json({
                message:error.message
            })
            
        }
     }

 



module.exports = {
    signUpEmployer,
    signUpJobSeeker,
    verifyUser,
    login,
    postJobs,
    getAllJobs,
    getOneJob,
    getAllRemoteJobs,
    getAllOnsiteJobs,
    partTimeJob,
    fullTimeJobs  
}














