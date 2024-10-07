const CommentModel = require("../models/CommentModel");

class CommentController {
  async addComment(req, res, next) {
    try {
      let newComment = await CommentModel.create(req.body);
      newComment = await newComment.populate("user");
      res.status(200).json({ message: newComment, success: true });
    } catch (error) {
      next(error);
    }
  }

  async getCommentOfAProduct(req, res, next) {
    const { id } = req.params;
    try {
      const comments = await CommentModel.find({ product: id })
        .populate(["user", "product"])
        .sort({ createdAt: -1 });
      res.status(200).json({ message: comments, success: true });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new CommentController();
