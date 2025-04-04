const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }
  
    console.log("connected");
  });

module.exports = db;
