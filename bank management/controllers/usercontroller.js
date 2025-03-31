const User = require("../models/user");












exports.signup=async (req, res) => {
  try {
    const { username,name, email, password, mobno, address } = req.body;
    const user = await User.create({ username,name, email, password, mobno, address });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


