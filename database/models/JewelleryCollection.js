const mongoose = require("mongoose");

const JewelleryCollectionSchema = new mongoose.Schema({
  name: String,
  description: {
    type: String,
    required: true,
    maxlength: [50, "Description must be 20 characters or less"],
  },
});
const JewelleryCollectionModel = mongoose.model(
  "JewelleryCollection",
  JewelleryCollectionSchema
);

module.exports = JewelleryCollectionModel;
