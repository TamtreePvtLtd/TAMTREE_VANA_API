const express = require("express");
const router = express.Router();

const customersController = require("../controllers/user/UserLogin");

const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//User
router.post("/login", use(customersController.login));
router.post("/signup", use(customersController.signup));
router.get("/logout", use(customersController.logout));
router.get("/isAuthorized",use(customersController.isAuthorized));
router.get(
  "/getUserByUserId/:userId",
  use(customersController.getUserByUserId)
);

module.exports = router;
