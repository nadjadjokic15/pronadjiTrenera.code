const db = require("../utils/db");


const Trainer = {
  
  getAllTrainers: (callback) => {
    const query = "SELECT * FROM trainers";
    db.query(query, (err, results) => {
      callback(err, results);
    });
  },

  
  addTrainer: (name, surname, imageUrl, description, role, callback) => {
    const query = "INSERT INTO trainers (name, surname,  description, location, type, price, image_url, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [name, surname,  description, location, type, price, imageUrl,role], (err, result) => {
      callback(err, result);
    });
  }
};

module.exports = Trainer;
