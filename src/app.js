const express = require('express') ; 
const app = express() ;
const mongoose = require("mongoose"); 
const hbs = require('hbs') ; 
const bodyParser = require('body-parser') ; 
const bcrypt = require("bcrypt");

const sendOTP = require('./otp/otp.js'); // REQUIRING OTP FILE 

app.use(express.json());   
 
// Use the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 2000;

require("./db/conn.js");
const AllUser = require("./models/registers");

app.set("view engine", "hbs");
app.set("views", "../template/views");
hbs.registerPartials("../template/partials");

app.get("/", async (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get('/otp' , (req,res)=>{
    res.render('enterotp') ; 
});
app.get('/send-otp', async(req,res)=>{
  res.render('/send-otp') ; 
});

app.post("/register", async (req, res) => {

   try{ 
    const username = req.body.username;                
    const email = req.body.useremail;
    const pass = req.body.password;
    const conpass = req.body.confirmpassword;
    const phone = req.body.phone ; 

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const emailExists = await AllUser.countDocuments({ email }); 

    if (emailExists > 0) {
      res.send(`<h1>This email already exists: ${email}</h1>`);
      return;
    }

    if (pass != conpass) {
      res.send(`<h1> Passwords Dont Match </h1>`);
      return;
    } else {
      const registerUser = new AllUser({
        name: `${username}`,
        email: `${email}`,
        password: `${hashedPassword}`,
        phone:`${phone}`
      });
      const registered = await registerUser.save(); 
      
      res.status(201).render("congo", {
        login_mess: `Successfully Registered `,
        welcome: `${username}`.toUpperCase(),
      }); 
    }
} catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});



  app.post("/login", async (req, res) => {
    try {
      const useremail = req.body.useremail;
      const pass = req.body.password;  
      
  
    // res.send(`USERNAME     , EMAIL = ${useremail} , PASS = ${pass} `) ; 

      AllUser.findOne({ email: useremail })
        .select("password name phone")
        .exec(async (err, user) => {
          if (err) {
            console.log(err, "Error Here 1");
            res.status(200).send("<h1>Oops ! Some error occurred !</h1>");
            return;
          }
  
          if (!user) {
            console.log("User not found");
            res.status(200).send("<h1>Oops ! User not found !</h1>");
            return;
          }
  
          const isMatched = await bcrypt.compare(pass, user.password);
  
          if (isMatched == true) {
            const otp = Math.floor(1000 + Math.random() * 9000);

            //Store the otp in DataBase
            AllUser.findOneAndUpdate({ email: useremail }, { otp: otp }, { new: true }, (error, user) => {
              if (error) {
                return res.status(400).send("Some Error Occured" );
              }
              else{
                console.log('OTP Pushed into DB , for ' , `${user.name}`) ; 
             }
            });

            sendOTP(user.phone , otp ) ; //Sending the OTP to the USER .

            res.status(201).render("send-otp");
          } else {
            res
              .status(200) 
              .send(
                `<h1> Wrong Credentials !!` // ${pass} != ${user.password} , isMAtched  = ${isMatched}</h1>`
              );
          }
        });
    } catch (err) {
      console.log(err);
      res.status(404).send(`<h1> Some Error Occured While Logging IN ! :(  </h1>`);
    }
  });
  

  app.post('/send-otp' , (req,res)=>{

    AllUser.findOne({ email: req.body.email })
    .select("name otp")
    .exec(async (err, user) => {
      const userotp = user.otp ; 
    try{
        if(userotp === req.body.enter_otp){
          user.otp = null ;  //So that otp cant be reused 
          res.render('success' , {mess : 'Logged IN !' , welcome:user.name}) ;  
        }
        else{
            res.send('OTPs DONT MATCH !!')  ; 
            // console.log(userotp) ; 
            // res.send(`<h2>${userotp} not equal to ${req.body.enter_otp}</h2>`) ; 
        }
    } 
    catch(err){
        console.log(err) ; 
        res.status(404).send('<h1>Some Error Occured !! </h1>') ; 
    }
  });
});

app.listen(PORT, () => {
    console.log(`Server is Running at port ${PORT}...`);
  }); 
    