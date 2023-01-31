const express = require('express') ; 
const app = express() ;
const hbs = require('hbs') ; 
const bodyParser = require('body-parser') ; 

app.use(express.json());   
 
// Use the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 2000;

app.set("view engine", "hbs");
app.set("views", "../template/views/task2");
hbs.registerPartials("../template/partials");

app.get("/", async (req, res) => {
  res.render("form1");
});
app.get("/form2", (req, res) => {
  res.render("form2");
});
app.get("/form3", (req, res) => {
  res.render("form3");
});

app.listen(5000 , ()=>{
    console.log('server running at 5000 ') ; 
})