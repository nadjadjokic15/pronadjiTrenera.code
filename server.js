const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/AuthRoute");
const trainerRoutes = require("./routes/TrainerRoute");
const appointmentRoutes=require("./routes/AppoitmentRoute")
const db=require("./utils/db")
 const mysql = require("mysql2");
require("dotenv").config();



const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api", trainerRoutes);  
app.use("/api", appointmentRoutes); 








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

