const Trainer = require("../models/TrainerModel");

exports.getTrainers = (req, res) => {
  Trainer.getAllTrainers((err, trainer) => {
    if (err) {
      return res.status(500).send("Error fetching trainers");
    }
    res.json(trainer);
  });
};

exports.addTrainer = (req, res) => {
  const { name, surname,  description, location, type, price, image_url} = req.body;
  const role = "TRAINER";  

  Trainer.addTrainer(name, surname, description, location, type, price, image_url, role, (err, result) => {
    if (err) {
      return res.status(500).send("Error adding trainer");
    }
    res.status(201).json({ id: result.insertId, name, surname, description, location, type, price, image_url, role });
  });
};
