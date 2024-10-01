const { getUser, getSessionUser, updateUser } = require("../controller/userController");

const router = require("express").Router();

router.get("/", getUser);
router.put("/",updateUser)
router.get("/sessionUser", getSessionUser);

module.exports = router;
