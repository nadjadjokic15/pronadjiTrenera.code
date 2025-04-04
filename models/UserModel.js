const bcrypt = require("bcryptjs");
const db = require("../utils/db");

const User = {
  
 
  createUser: async (username, email, mobile, password, role) => {
    try {
    
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = "INSERT INTO client (username, email, mobile, password, role) VALUES (?, ?, ?, ?, ?)";
      
      
      return new Promise((resolve, reject) => {
        db.query(query, [username, email, mobile, hashedPassword, role], (err, result) => {
          if (err) {
            reject(err); 
          }
          resolve(result); 
        });
      });
    } catch (err) {
      console.error("Error hashing password", err);
      throw err; 
    }
  },

  
  findUserByEmail: async (email) => {
    const query = "SELECT * FROM client WHERE email = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [email], (err, result) => {
        if (err) {
          reject(err); 
        }
        resolve(result[0]);
      });
    });
  },


  verifyPassword: async (inputPassword, storedPassword) => {
    try {
      return await bcrypt.compare(inputPassword, storedPassword); 
    } catch (err) {
      console.error("Error verifying password", err);
      throw err; 
    }
  }
};

module.exports = User;
