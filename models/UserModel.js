const bcrypt = require("bcryptjs");
const db = require("../utils/db");
const Trainer = require("./TrainerModel");

const User = {

  
  createUser: async (username, email, mobile, password, role, name, surname, description, price, type, location, image_url) => {
    try {
      
      const existingUserByEmail = await User.findUserByEmail(email);
      if (existingUserByEmail) {
        throw new Error("Email is already registered.");
      }

      const existingUserByUsername = await User.findUserByUsername(username);
      if (existingUserByUsername) {
        throw new Error("Username is already taken.");
      }

      
      console.log("Hashing password for user:", username);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(`Password hashed for ${username}`);

      
      if (role === "trainer") {
        return new Promise((resolve, reject) => {
          Trainer.addTrainer(username, email, mobile, hashedPassword, name, surname, description, price, type, location, image_url, role, (err, result) => {
            if (err) {
              console.error("Error during trainer creation:", err);
              reject("Error during trainer creation");
              return;
            }
            console.log(`Trainer created successfully: ${username}`);
            resolve(result);
          });
        });
      } else {
        const query = "INSERT INTO users (username, email, mobile, password, role) VALUES (?, ?, ?, ?, ?)";
        return new Promise((resolve, reject) => {
          db.query(query, [username, email, mobile, hashedPassword, role], (err, result) => {
            if (err) {
              console.error("Error during user creation:", err);
              reject("Error during user creation");
              return;
            }
            console.log(`User created successfully: ${username}`);
            resolve(result);
          });
        });
      }
    } catch (err) {
      console.error("Error hashing password or creating user:", err);
      throw new Error(err.message || "Error creating user");
    }
  },

  
  findUserByEmail: async (email) => {
    console.log(`Searching for user with email: ${email}`);

    const query = "SELECT * FROM users WHERE email = ?";
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

  
  findUserByUsername: async (username) => {
    console.log(`Searching for user with username: ${username}`);

    const query = "SELECT * FROM users WHERE username = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [username], (err, result) => {
        if (err) {
          console.error("Error querying database for user by username:", err);
          reject("Error querying user by username");
          return;
        }

        if (result.length === 0) {
          console.log(`No user found with username: ${username}`);
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

module.exports = User;
