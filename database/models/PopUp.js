const mongoose = require("mongoose");

const PopUpSchema = new mongoose.Schema({
  title: String,
  //   images: [
  //     {
  //       type: String,
  //       required: false,
  //     },
  //   ],
  description: {
    type: String,
    required: true,
  },
});
const PopUpModel = mongoose.model("PopUpData", PopUpSchema);

module.exports = PopUpModel;
