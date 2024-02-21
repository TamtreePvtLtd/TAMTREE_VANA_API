const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin/AdminLogin");

const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//Admin
router.post("/signup",use(
    adminController.saveAdminCredentials
));
router.post("/login", use(adminController.adminLogin));

router.get("/isAuthorized",use(adminController.isAdminAuthorized));

router.get("/logout", use(adminController.adminLogout));

module.exports = router;
