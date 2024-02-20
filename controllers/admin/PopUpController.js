/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */

const PopUpModel = require("../../database/models/PopUp");

exports.createPopUpCollection = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const PopUpDoc = await PopUpModel.create({
      title: title.trim(),
      description: description.trim(),
    });

    res.json({
      data: PopUpDoc,
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
