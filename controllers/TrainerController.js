const Trainer = require("../models/TrainerModel");

exports.getTrainers = (req, res) => {
  console.log("Fetching all trainers...");
  Trainer.getAllTrainers((err, trainers) => {
    if (err) {
      console.error("Error fetching trainers:", err);
      return res.status(500).send("Error fetching trainers");
    }

    console.log(`Found ${trainers.length} trainers.`);
    res.json(trainers);
  });
};

exports.addTrainer = (req, res) => {
  const { name, surname, description, location, type, price, image_url } = req.body;
  const role = "trainer";

  
  console.log("Checking if trainer already exists...");

  Trainer.getAllTrainers((err, trainers) => {
    if (err) {
      console.error("Error checking if trainer exists:", err);
      return res.status(500).send("Error checking if trainer exists");
    }

    
    const existingTrainer = trainers.find(trainer => trainer.name === name && trainer.surname === surname);
    if (existingTrainer) {
      console.log("Trainer with this name already exists.");
      return res.status(400).send("Trainer with this name already exists.");
    }

    
    Trainer.addTrainer(name, surname, description, location, type, price, image_url, role, (err, result) => {
      if (err) {
        console.error("Error adding trainer:", err);
        return res.status(500).send("Error adding trainer");
      }

      console.log(`Trainer added successfully: ${name} ${surname}`);
      res.status(201).json({
        id: result.insertId,
        name,
        surname,
        description,
        location,
        type,
        price,
        image_url,
        role
      });
    });
  });
};
