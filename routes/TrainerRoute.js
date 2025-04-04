const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/TrainerController");
const authMiddleware = require("../middlewares/AuthMiddleware");

router.get("/trainers", trainerController.getTrainers);
router.post("/trainers", authMiddleware.authenticate, trainerController.addTrainer);

module.exports = router;
