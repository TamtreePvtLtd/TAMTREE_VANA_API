const mongoose = require("mongoose");

const JewelleryCollectionSchema = new mongoose.Schema({
  name: String,
  description: {
    type: String,
    required: true,
  },
});
const JewelleryCollectionModel = mongoose.model(
  "JewelleryCollection",
  JewelleryCollectionSchema
);

module.exports = JewelleryCollectionModel;
