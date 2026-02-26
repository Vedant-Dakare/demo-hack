const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }


  console.log("Register hit", req.body);
};

// Login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials with no user ");
      error.statusCode = 400;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials not match the user ");
      error.statusCode = 400;
      return next(error);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    };

    res.cookie("token", token, options).json({
      token
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe: (req, res) => {
    // Return the authenticated user's profile
    res.json(req.user);
  }
};
