const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userService = require("../services/userService");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    return next(new Error("Please provide name, email, and password"));
  }

  try {
    const userExists = await userService.getUserByEmail(email);

    if (userExists) {
      res.status(400);
      return next(new Error("User already exists with this email"));
    }

    const user = await userService.createUser(name, email, password);

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
        },
      });
    } else {
      res.status(400);
      return next(new Error("Invalid user data"));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error("Please provide email and password"));
  }

  try {
    const user = await userService.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
        },
      });
    } else {
      res.status(401);
      return next(new Error("Invalid email or password"));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
