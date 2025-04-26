const UserModel = require("../models/userModel");
const AuthService = require("../services/AuthService");
const Emailservice = require("../services/Emailservice");

const registerUser = async (req, res, next) => {
  try {
    const newUser = await UserModel.create(req.body);
    await Emailservice.sentEmailConfirmationEmail(newUser.email);
    return res.status(200).json({ message: newUser, success: true });
  } catch (error) {
    next(error);
  }
};
const loginUser = async (req, res, next) => {
  const { email, password: userPassword } = req.body;

  try {
    if (!email || !userPassword) {
      throw Error("fill all the creadentials");
    }

    const loggedInUser = await UserModel.findOne({ email });

    if (!loggedInUser) {
      throw Error("this email is not registered");
    }

    if (userPassword !== loggedInUser.password) {
      throw Error("Invalid creadentials");
    }

    if (!loggedInUser.isVerfied) {
      throw Error("Your email is not verified");
    }

    const { password, ...other } = loggedInUser._doc;
    req.session.user = other;

    res.status(200).json({ message: other });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (!err) {
        res.clearCookie("thrift.sid");
        res.status(200).json({ message: "logged out" });
      } else {
        res.status(404).json({ message: "failed to logout" });
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifyConfirmationEmailHash = async (req, res, next) => {
  const { hash } = req.body;

  try {
    const data = await AuthService.verifyIfEmailConfCodeIsValid(hash);
    res.status(200).json({ message: data, success: true });
  } catch (error) {
    next(error);
  }
};
const confirmEmailHash = async (req, res, next) => {
  const { hash, email } = req.body;

  try {
    const data = await AuthService.verifyIfEmailConfCodeIsValid(hash);

    if (!data.email) {
      throw new Error("Invalid Link");
    } else {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: data.email },
        {
          isVerfied: true,
        },
        {
          new: true,
          returnDocument: true,
        }
      );
      res.status(200).json({ message: updatedUser, success: true });
    }
  } catch (error) {
    next(error);
  }
};
const verifyUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("This email is not registered.");
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      {
        isVerfied: true,
      },
      {
        new: true,
        returnDocument: true,
      }
    );
    res.status(200).json({ message: updatedUser, success: true });
  } catch (error) {
    console.log("verify", error.message);
    next(error);
  }
};

const sendConfirmationEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    await Emailservice.sentEmailConfirmationEmail(email);
    res
      .status(200)
      .json({ message: "successfully resent confimation link", success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyConfirmationEmailHash,
  confirmEmailHash,
  verifyUser,
  sendConfirmationEmail,
};
