const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.register = async (req, res) => {
  const { username, email, mobile, password, role } = req.body;

  try {
    const result = await User.createUser(username, email, mobile, password, role || "USER");
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error registering user", err);
    res.status(500).send("Error registering user");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isPasswordCorrect = await User.verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Incorrect password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in", err);
    res.status(500).send("Error logging in");
  }
};

exports.logout = (req, res) => {
  res.status(200).send("Logged out successfully");
};
