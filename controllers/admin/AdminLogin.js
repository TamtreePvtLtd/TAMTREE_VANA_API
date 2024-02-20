const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, ACCESS_TOKEN, ExpirationInMilliSeconds } = require("../../constants/Constants");
const AdminModel = require("../../database/models/Admin");



/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
exports.saveAdminCredentials = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const existingAdmin = await AdminModel.findOne({ email });

    if (existingAdmin) {
      const error = new Error("Admin already exists");
      error.statusCode = 409;
      throw error;
    }
else {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin credentials with hashed password
    const newAdmin = new AdminModel({ email, password: hashedPassword });
    const savedAdmin = await newAdmin.save();

    const token = jwt.sign(
      {
        adminId: savedAdmin._id,
        email:savedAdmin.email,
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
          adminId: savedAdmin._id,
          email:savedAdmin.email
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
exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    const error = new Error("Empty credentials supplied");
    error.statusCode = 454;
    throw error;
  }else{
  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      const error = new Error("Admin not found");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid credentials entered");
      error.statusCode = 401;
      throw error;
    }

    var adminObj = {
      adminId: admin._id,
      email: admin.email,
    };

    const token = jwt.sign(adminObj, SECRET_KEY);

    res.cookie(ACCESS_TOKEN, token, {
      httpOnly: true,
      maxAge: ExpirationInMilliSeconds, // 2 days
    });

    res.status(200).json({
      message: "Admin login successful",
      data: adminObj,
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


exports.isAdminAuthorized = async (req, res) => {
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
    const { adminId } = decoded;

    // Check if the userId exists in the UserModel database
    const admin = await AdminModel.findById(adminId);
    if (!admin) {
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
exports.adminLogout = async (req, res) => {
  res.clearCookie(ACCESS_TOKEN,this.isAdminAuthorized);
  res.status(200).json({
    status: true,
    message: "Admin logged out successfully",
    data: null,
  });
};