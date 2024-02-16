const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  SECRET_KEY,
  ACCESS_TOKEN,
  ExpirationInMilliSeconds,
} = require("../../constants/Constants");
const UserModel = require("../../database/models/User");

/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
exports.signup = async (req, res, next) => {
  let { userName, phoneNumber, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ phoneNumber });
    if (existingUser) {
      const error = new Error(
        "Invalid User with provided phonenumber already exists entered!"
      );
      error.statusCode = 409;
      throw error;
    } else {
      // Generate salt
      const salt = await bcrypt.genSalt(10);
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        userName,
        phoneNumber,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: savedUser._id,
          phoneNumber: savedUser.phoneNumber,
          email:savedUser.email,
          userName: savedUser.userName,
        },
        SECRET_KEY
      );

      res
        .cookie(ACCESS_TOKEN, token, {
          httpOnly: true,
          maxAge: ExpirationInMilliSeconds, //2days
        })
        .status(200)
        .json({
          message: "Signup Successful",
          data: {
            userId: savedUser._id,
            phoneNumber: savedUser.phoneNumber,
            userName: savedUser.userName,
            email:savedUser.email
          },
        });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */

exports.login = async (req, res, next) => {
  let { email, password } = req.body;

  if (email === "" || password === "") {
    const error = new Error("Empty credentials supplied");
    error.statusCode = 454;
    throw error;
  } else {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        const error = new Error("User Not Available Please Signup to continue");
        error.statusCode = 401;
        throw error;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const error = new Error("Invalid credentials entered!");
        error.statusCode = 400;
        throw error;
      }

      var userObj = {
        userId: user._id,
        email: user.email,
        userName: user.userName,
        phoneNumber:user.phoneNumber
      };

      const token = jwt.sign(userObj, SECRET_KEY);

      res.cookie(ACCESS_TOKEN, token, {
        httpOnly: true,
        maxAge: ExpirationInMilliSeconds, //2 days
      });

      res.status(200).json({
        message: "Login successful",
        data: userObj,
      });
    } catch (error) {
      next(error);
    }
  }
};

/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
exports.logout = async (req, res) => {
  res.clearCookie(ACCESS_TOKEN);
  res.status(200).json({
    status: true,
    message: "Logged out successfully",
    data: null,
  });
};

exports.isAuthorized = async (req, res) => {
  const { nks_access_token } = req.cookies;

  if (nks_access_token) {
    // Check if the access token is valid
    const payload = await validateAccessToken(nks_access_token);
    if (payload) {
      res.json(payload);
    } else {
      res.json(null);
    }
  } else {
    res.json(null);
  }
};

async function validateAccessToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { userId } = decoded;

    // Check if the userId exists in the UserModel database
    const user = await UserModel.findById(userId);
    if (!user) {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
exports.getUserByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId).select(
      "name phoneNumber email"
    );

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    return res.json(user);
  } catch (error) {
    next(error);
  }
};
