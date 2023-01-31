const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const ACCOUNT_SID = " " ;    //add your respective fields here
const AUTH_TOKEN = " " ; //add your respective fields here
const twilio_ph_no = '+ ' ; //add your respective fields here

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

const sendOTP = (ph,otp)=> {
  // const otp = Math.floor(1000 + Math.random() * 9000);

  client.messages
    .create({
      to: `+91 ${ph}`,
      from: `+${twilio_ph_no}`,
      body: `Your OTP is ${otp}` 
    })
    .then(() => {
      console.log('OTP Sent Successfully , to phone : ', ph) ; 
      // res.send('OTP sent successfully');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error sending OTP');
    });
};

module.exports = sendOTP;

















