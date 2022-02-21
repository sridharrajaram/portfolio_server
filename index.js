const express = require('express');
const app = express();

require('dotenv').config()

const PORT = process.env.PORT||5000;

const cors = require('cors');
const nodemailer = require('nodemailer');


app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(cors());

app.get('/',(req,res)=>{
    res.send("welcome to myserver");
})

app.post('/send_mail', (req, res)=>{
    let data = req.body;

    const smtpTransport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

   let mailOptions = {
       from:data.email,
       to:process.env.MAIL_TO,
       cc:`${data.email}`,
       subject:`Portfolio Mail from ${data.fullname}`,
       html:`
       <h3>Informations</h3>
        <ul>
            <li>Full Name: ${data.fullname}</li>
            <li>Email: ${data.email}</li>
            <li>Subject: ${data.subject}</li>
        </ul>
        <h3>Message</h3>
        <p>${data.message}</p>
        `
   }

   smtpTransport.sendMail(mailOptions, (error,response) => {
        if(error){
            res.send(error);
        }else{
            res.status(201).json({
                message:"Mail sent successfully"
            });
        }
   })

   smtpTransport.close();

})

app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`);
})
