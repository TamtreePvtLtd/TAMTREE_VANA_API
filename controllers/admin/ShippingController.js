/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */
const mongoose = require("mongoose");
const ShippingDetailModel = require("../../database/models/Shipping");

exports.createShipping = async (req, res, next) => {
  try {
    const formData = req.body;

    const newShippingDetail = await ShippingDetailModel.create({
      title: formData.title,
      price: formData.price,
    });
    res;
    res.json({
      data: newShippingDetail,
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllShippingDetails = async (req, res, next) => {
  try {
    const shippingDetails = await ShippingDetailModel.find();
    res.json(shippingDetails);
  } catch (error) {
    error = new Error("Error get All shipping");
    error.statusCode = 513;
    next(error);
  }
};

/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */


exports.updateShippingDetails = async (req, res, next) => {
  try {
    const shippingDetailsId = req.params.shippingDetailsId;
    if (!shippingDetailsId) {
      return res
        .status(400)
        .json({
          statusCode: 400,
          status: "error",
          message: "Shipping Details ID is required",
        });
    }

    const formData = req.body;
    if (!formData) {
      return res
        .status(400)
        .json({
          statusCode: 400,
          status: "error",
          message: "formData not found",
        });
    }

    const updatedShippingDetail = await ShippingDetailModel.findByIdAndUpdate(
      shippingDetailsId,
      formData,
      { new: true }
    );

    if (!updatedShippingDetail) {
      return res
        .status(404)
        .json({
          statusCode: 404,
          status: "error",
          message: "Shipping detail not found",
        });
    }

    res.json(updatedShippingDetail);
  } catch (error) {
    next(error);
  }
};
