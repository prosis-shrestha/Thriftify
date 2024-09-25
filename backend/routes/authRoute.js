const {
  registerUser,
  loginUser,
  logoutUser,
  verifyConfirmationEmailHash,
  verifyUser,
  confirmEmailHash,
  sendConfirmationEmail,
} = require("../controller/authController");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verifyConfirmationEmailHash",verifyConfirmationEmailHash)
router.post("/confirmEmail",confirmEmailHash)
router.post("/verifyAccount",verifyUser);
router.post("/sentConfirmationlink",sendConfirmationEmail)
module.exports = router;
