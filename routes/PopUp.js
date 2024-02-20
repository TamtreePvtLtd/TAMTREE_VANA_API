const express = require("express");
const router = express.Router();

const adminPopUpController = require("../controllers/admin/PopUpController");
const userPopUpController = require("../controllers/user/PopUpController");
const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/createPopUpCollection",
  use(adminPopUpController.createPopUpCollection)
);

router.get("/getPopUpCollection", use(userPopUpController.getPopUpCollection));
module.exports = router;
