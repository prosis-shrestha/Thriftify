const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProductByUser,
} = require("../controller/productController");
const adminAuth = require("../middlewares/adminAuth");

const router = require("express").Router();

// Public routes
router.get("/", getProduct);
router.get("/search", searchProductByUser);

// Admin protected routes
router.post("/create", adminAuth, createProduct);
router.put("/:id", adminAuth, updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

module.exports = router;
