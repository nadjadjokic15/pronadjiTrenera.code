const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Trainer = require("../models/TrainerModel");

exports.register = async (req, res) => {
  const { username, email, mobile, password, role, name, surname, description, price, type, location, image_url } = req.body;

  console.log("Starting registration...");

  try {
    
    if (role === "trainer") {
      const result = await User.createUser(username, email, mobile, password, role, name, surname, description, price, type, location, image_url);
      return res.status(201).json({ message: "Trainer created successfully" });
    }

    
    const result = await User.createUser(username, email, mobile, password, role || "CLIENT");
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error registering user or trainer", err);
    res.status(500).send("Error registering user or trainer");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findUserByEmail(email);
    let role="client";
    if(!user){
      user = await Trainer.findUserByEmail(email);
      role="trainer";
    }

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isPasswordCorrect = await User.verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Incorrect password");
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in", err);
    res.status(500).send("Error logging in");
  }
};

exports.logout = (req, res) => {
  res.status(200).send("Logged out successfully");
};
