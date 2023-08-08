const userController = require("../controllers/user");
const router = require("express").Router();

router.post("/signup", userController.addUser);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/verifyToken", userController.verifyToken);
router.post("/updatePassword", userController.updatePassword);
module.exports = router;
