const CommentController = require("../controller/CommentController");

const router = require("express").Router();

router.post("/create", CommentController.addComment);
router.get("/product/:id", CommentController.getCommentOfAProduct);
module.exports = router;
