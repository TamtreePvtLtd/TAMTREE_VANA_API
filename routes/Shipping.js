const express = require("express");
const router = express.Router();

const ShippingController = require("../controllers/admin/ShippingController");

const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//Admin Controller
router.post("/createShipping", use(ShippingController.createShipping));
router.get(
  "/getAllShippingDetails",
  use(ShippingController.getAllShippingDetails)
);
router.put(
  "/updateShippingDetails/:shippingDetailsId",
  use(ShippingController.updateShippingDetails)
);
module.exports = router;
