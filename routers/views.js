const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("./../controllers/authController");

const router = express.Router();
//, authController.isLoggedIn
router.get("/", viewsController.getOverview);
// router.post(
//   "/submit-user-data",
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
