const mongoose = require("mongoose");
const JewelleryItemModel = require("../../database/models/JewelleryItems");


/**
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */




exports.getMyBag = async (req, res, next) => {
    const { JewelleryItemId } = req.params;
    try {
        const jewelleryItemId = new mongoose.Types.ObjectId(JewelleryItemId);

        const jewelleryItem = await JewelleryItemModel.findById(jewelleryItemId);
        if (!jewelleryItem) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        const { _id, posterURL, title, price } = jewelleryItem;

        res.json({ _id, posterURL, title, price });

    } catch (error) {
        next(error);
    }
};


