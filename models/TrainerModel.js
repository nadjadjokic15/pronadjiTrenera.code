const db = require("../utils/db");
const bcrypt = require("bcryptjs");

const Trainer = {

  
  getAllTrainers: (callback) => {
    const query = "SELECT * FROM trainers";
    db.query(query, (err, results) => {
      callback(err, results);
    });
  },

  
  addTrainer: (username, email, mobile, password, name, surname, description, price, type, location, image_url, role , callback) => { 
   
    const query = "INSERT INTO trainers (username, email, mobile, password, name, surname, description, price, type, location, image_url, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [username, email, mobile, password, name, surname, description, price, type, location, image_url, role], (err, result) => {
      callback(err, result);
    });
  },



  findUserByEmail: async (email) => {
    console.log(`Searching for user with email: ${email}`);

    const query = "SELECT * FROM trainers WHERE email = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [email], (err, result) => {
        if (err) {
          console.error("Error querying database for user by email:", err);
          reject("Error querying user by email");
          return;
        }

        if (result.length === 0) {
          console.log(`No user found with email: ${email}`);
          resolve(null); 
        } else {
          console.log(`User found: ${result[0].username}`);
          resolve(result[0]);
        }
      });
    });
  },

  verifyPassword: async (inputPassword, storedPassword) => {
    try {
      console.log("Verifying password...");
      const isMatch = await bcrypt.compare(inputPassword, storedPassword);
      
      if (isMatch) {
        console.log("Password matches!");
      } else {
        console.log("Password does not match.");
      }

      return isMatch;
    } catch (err) {
      console.error("Error verifying password:", err);
      throw new Error("Error verifying password");
    }
  }
};






module.exports = Trainer;
