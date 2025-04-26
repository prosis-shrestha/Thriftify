const {
  createCategory,
  getCategory,
  deleteCategory,
} = require("../controller/categoryController");
const adminAuth = require("../middlewares/adminAuth");

const router = require("express").Router();

// Public routes
router.get("/", getCategory);

// Admin protected routes
router.post("/create", adminAuth, createCategory);
router.delete("/:id", adminAuth, deleteCategory);

module.exports = router;
