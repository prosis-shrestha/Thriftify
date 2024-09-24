const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to Mongoose");
  } catch (error) {
    console.log("error connecting to mongoDB");
  }
};
