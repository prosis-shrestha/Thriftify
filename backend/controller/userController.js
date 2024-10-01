const userModel = require("../models/userModel");

const getUser = async (req, res, next) => {
  try {
    const users = await userModel.find({ ...req.query });
    res.status(200).json({ message: users });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  const {email} = req.body;
  try {
    const users = await userModel.findOneAndUpdate({email},{
      $set:req.body
    },{
      new:true,
      returnDocument:true
    })
    res.status(200).json({ message: users , success:true });
  } catch (error) {
    next(error);
  }
};


const getSessionUser = async (req, res, next) => {
  try {
    const loggedInUser = req.session.user;
    if (loggedInUser) {
      res.status(200).json({ message: loggedInUser });
    } else {
      res.status(404).json({ message: "you are not logged in" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, getSessionUser ,updateUser};
