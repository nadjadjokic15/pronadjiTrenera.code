const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/AuthRoute");
const trainerRoutes = require("./routes/TrainerRoute");

 const mysql = require("mysql2");
require("dotenv").config();



const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api", trainerRoutes);  







const ROLE_USER = "USER";
const ROLE_TRAINER = "TRAINER";




app.get("/roles", (req, res)=>{
         res.json([ROLE_USER, ROLE_TRAINER])
     })


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

