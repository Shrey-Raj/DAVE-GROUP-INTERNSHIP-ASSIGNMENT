const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const ACCOUNT_SID = "AC44a03bd8c843221b598b6bbb6913c45d" ; 
const AUTH_TOKEN = "d0f27a9a00cafe0a5a68a633c24c38c7" ; 
const twilio_ph_no = '+16089753215' ; 

// Replace the placeholder values with your Twilio account SID and auth token
const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

app.get('/send-otp', (req, res) => {
  // Generate a random OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Replace the placeholder values with the recipient's phone number and your Twilio number
  client.messages
    .create({
      to: '+91 8726188404',
      from: `+${twilio_ph_no}`,
      body: `Your OTP is ${otp}` 
    })
    .then(() => {
      // Save the OTP to the database for later verification
      // ...

      res.send('OTP sent successfully');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error sending OTP');
    });
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
