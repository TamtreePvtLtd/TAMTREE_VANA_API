const mongoose = require("mongoose");

const ShippingDetailSchema = new mongoose.Schema({
  title: String,
  price: Number,
});

const ShippingDetailModel = mongoose.model("ShippingDetail",ShippingDetailSchema);

module.exports = ShippingDetailModel;
