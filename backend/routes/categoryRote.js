const {
  createCategory,
  getCategory,
  deleteCategory,
} = require("../controller/categoryController");

const router = require("express").Router();

router.post("/create", createCategory);
router.get("/", getCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
