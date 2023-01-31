const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/NodeJs_Internship")
  .then(() => console.log("Connection  Successful with database"))
  .catch((err) => console.log(err));