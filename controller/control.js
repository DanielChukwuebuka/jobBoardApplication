const userModel = require("../onboardModel/model");
const jobModel = require("../jobModel/jobmodel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");


const signUp = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, role } = req.body;
    
    const checkMail = await userModel.findOne({ email: email });
    if (checkMail) {
      return res.status(400).json({
        message: "this email is associated with an account",
      });
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await new userModel({
      firstName,
      lastName,
      phoneNumber,
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    if (!user) {
      return res.status(404).json({
        message: "cannot create ",
      });
    }
    
    await user.save();

    const token = jwt.sign(
        {
          userId: user._id,
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email.toLowerCase(),
        },
        process.env.secret,
        { expiresIn: "1day" }
      );


    const link = (`${req.protocol}://${req.get("host")}/verify/${user.id}/${user.token}`,
      user.firstName,
      user.lastName);
    const html = generateDynamicEmail(firstName, lastName, link);


    sendMail({
      email: user.email,
      html: html,
      subject:"Kindly verify",
      message: link,
    });

    res.status(201).json({
      message: "Welcome, User created successfully",
      data: user,
      token
    });
    next()
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};





const verifyUser = async (req, res) => {
  try {
    const id = req.params.id;
    const registeredUser = await userModel.findById(id);
    const registeredToken = registeredUser.token;
    await jwt.verify(registeredToken, process.env.secret, (err, data) => {
      if (err) {
        return res.status(300).json({
          message: "this link has expired",
        });
      } else {
        return data;
      }
    });
    const verified = await userModel.findByIdAndUpdate(req.params.id, {
      isVerified: true,
    });
    if (!verified) {
      return res.status(400).json({
        message: "unable to verify user",
      });
    } else {
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
    const { email, password } = req.body;

    const userExists = await userModel.findOne({ email: email.toLowerCase() });

    if (!userExists) {
      return res.status(404).json({
        message: "user not found",
      });
    }

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

    const  jobs =
      req.body;
console.log(jobs)
    const user = req.user
    console.log(user)

    if(user.role!== "employer"){
        res.status(403).json({
            message:"you are not authorized" ,
          });
    }

const job = await jobModel.create(req.body)
res.status(201).json({
    message: "job created successfully",
    data:job
})

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
    // const queryParams = req.query
    // console.log(queryParams)
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




