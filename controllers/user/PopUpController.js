const PopUpModel = require("../../database/models/PopUp");

/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
exports.getPopUpCollection = async (req, res, next) => {
  try {
    const PopUpData = await PopUpModel.find();
    res.json(PopUpData);
  } catch (error) {
    error = new Error("Error get All PopUpData");
    error.statusCode = 513;
    next(error);
  }
};
