module.exports = (error, req, res, next) => {
  return res.status(403).json({ message: error.message });
};
