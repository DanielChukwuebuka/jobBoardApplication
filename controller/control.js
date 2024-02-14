//require your users model
const userModel = require("../onboardModel/model");

//require your jon model
const jobModel = require("../jobModel/jobmodel");

// require bcrypt library to hash your password
const bcrypt = require("bcrypt");

//require dotenv to access what is hidden in the .env file
require("dotenv").config();

//require jsonwebtoken to use token in your users functionalities
const jwt = require("jsonwebtoken");

const {generateDynamicEmail} = require("../jobhtml")

const sendEmail= require("../jobmailer")

//write a function to create a signup for your user
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password,userName, role } = req.body;
 
    // check if the user exist before in the database with the email
    const checkMail = await userModel.findOne({ email: email });
    if (checkMail) {
      return res.status(400).json({
        message: "this email is associated with an account",
      });
    }

    //hashing the users password for security purposes
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // users entered data 
    const user = await new userModel({
      firstName,
      lastName,
      phoneNumber,
      email: email.toLowerCase(),
      password: hashedPassword,
      userName,
      role
    });

    // a conditional statement when there is no user created
    if (!user) {
      return res.status(404).json({
        message: "cannot create ",
      });
    }
    
    // save the users entered data

    await user.save();

    // get the users token using the bearers authentication token

    const token = jwt.sign(
        {
          userId: user._id,
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email.toLowerCase(),
          userName:user.userName
        },
        process.env.secret,
        { expiresIn: "1day" }
      );

      const generateOTP = () =>{
        const min = 1000;
        const max = 9999;
        
        return Math.floor(Math.random() *(max - min + 1)) + min
        }
        const otp = generateOTP();
        user.otp = otp
        sendEmail({
        
        email:user.email,
        subject:'KINDLY VERIFY YOUR ACCOUNT',
        html: generateDynamicEmail(otp, user.firstName, user.lastName)
        
        })
        //­html: generateDynamicEmail(`$­{req.protocol}://­${req.get("host")}/­verify/${user.id}/­${user.token}`, user.firstName, user.lastName)
    

    res.status(201).json({
      message: "Welcome, User created successfully",
      data: user,
      token
    });
// throw an server error message if there s an error with the 500 status code
  }
   catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// verify the user with the token

const verifyUser = async (req, res) => {
  try {

    // get the users id
    const id = req.params.id;
    // find the user by id and tie to the token
    const registeredUser = await userModel.findById(id);
    const registeredToken = registeredUser.token;
    // verify the user and token
    await jwt.verify(registeredToken, process.env.secret, (err, data) => {
      if (err) {
        return res.status(300).json({
          message: "this link has expired",
        });
      } else {
        return data;
      }
    });

    // update the user to be verified
    const verifiedUser = await userModel.findByIdAndUpdate(id, {
      isVerified: true,
    },{new:true});

      if(verifiedUser.isVerified === true){ 
        return res.status(200).json({
          message: `${registeredUser.firstName} your account have been verified successfully`,
        });
      }
    
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailOruserName, password } = req.body;

    const userExists = await userModel.findOne({$or: [{email:emailOruserName}, {userName: emailOruserName}]});

    if (!userExists) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    console.log(userExists)
    const checkPassword = bcrypt.compareSync(password, userExists.password);
    if (!checkPassword) {
      return res.status(401).json({
        message: "incorrect password",
      });
    }
    const token = jwt.sign(
      {
        userId: userExists._id,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        email: userExists.email.toLowerCase(),
        userName: userExists.userName
      },
      process.env.secret,
      { expiresIn: "1day" }
    );

    res.status(200).json({
      message: `Login successful, welcome ${userExists.firstName}`,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const postJobs = async (req, res,next) => {
  try {

    // request  body to pass in the fileds
    const  jobs =
      req.body;
console.log(jobs)

 // get the authorised or unauthorised user
    const user = req.user
    console.log(user)

    // set an authorisation condition for the user alone to post jobs

    if(user.role !== "employer"){
       return  res.status(403).json({
            message:"you are not authorized" ,
          });
    }
// create the job , save it and send a success message

const job = await jobModel.create(req.body)
return res.status(201).json({
    message: "job created successfully",
    data:job
})

//run the next function because its a middleware
next()
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const getAllJobs = await jobModel.find();

    if (getAllJobs.length === 0) {
      return res.status(404).json({
        message: "No jobs available",
      });
    } else {
      return res.status(200).json({
        message: "Here are all the jobs available",
        data: getAllJobs,
        length:getAllJobs.length + " " +  "jobs are available currently",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getOneJob = async (req, res) => {
  try {
    const id = req.params.id;
    const job = await jobModel.findById(id);
    if (!job) {
      return res.status(404).json({
        message: `job with id ${id} not found`,
      });
    } else {
      return res.status(200).json({
        message: `Here is the job with id ${id}`,
        data: job,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllJobsByType = async (req, res) =>{

try {

  // use
  const query = req.query.jobType ? {jobType: req.query.jobType} : {}
  const jobs = await jobModel.find(query)
  res.status(200).json({
    message:"All jobs by type",
    length: jobs.length + " " + "are currently avavilable",
    data: jobs
  })

} catch (error) {
   res.status(500).json({
    message: error.message
   })
}

}


const logout = async(re, res)=>{

try {
  








} catch (error) {
  res.status(500).json({
    message:"internal server error"+error.message
  })
  
}





}



module.exports = {
  signUp,
  verifyUser,
  login,
  postJobs,
  getAllJobs,
  getOneJob,
  getAllJobsByType

};























// const remoteJobs = async () => {
//   try {
//     const remoteJobs = await jobModel.find({ category: remoteJobs });
//     if (!remoteJobs) {
//       return res.status(404).json({
//         message: "no remote jobs available",
//       });
//     } else {
//       return res.status(200).json({
//         message: "here are all remote jobs",
//         data: remoteJobs.length,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };




