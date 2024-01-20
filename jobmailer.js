
const nodemailer = require("nodemailer")
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async (options) => {
const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
port: 587,
service:process.env.service,
secure: false,
auth: {
user: process.env.user,
pass: process.env.mailPass
},
tls: {
rejectUnauthorized: false,
},
});


async function main() {
const info = await transporter.sendMail({
from: process.env.user,
to: options.email,
subject: options.subject,
text: options.message,
});

console.log("Message­ sent: %s", info.messageId);
}
main().catch(console.error);
};



module.exports =sendMail;