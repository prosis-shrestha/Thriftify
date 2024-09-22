const productModel = require("../models/productModel");

const createProduct = async (req, res, next) => {
  try {
    // Extract lat and lon from req.body
    const { lat, lon, ...productData } = req.body;

    // Construct the location field
    const location = {
      type: "Point",
      coordinates: [lon, lat],
    };

    // Add location to the product data
    const newProductData = {
      ...productData,
      lat,
      lon,
      location,
    };

    const newProduct = await productModel.create(newProductData);
    return res.status(200).json({ message: newProduct });
  } catch (error) {
    next(error);
  }
};
const getProduct = async (req, res, next) => {
  const { category, _id } = req.query;
  let products;
  try {
    // First, update any expired boosts
    const now = new Date();
    await productModel.updateMany(
      { boosted: true, boostEndDate: { $lte: now } },
      { $set: { boosted: false }, $unset: { boostEndDate: "" } }
    );

    // Then fetch the products
    if (category || _id) {
      products = await productModel.find({ ...req.query }).populate("owner");
    } else {
      products = await productModel.find({}).populate("owner");
    }
    return res.status(200).json({ message: products, status: 200 });
  } catch (error) {
    next(error);
  }
};

const reduceQuantityOfProduct = async (req, res, next) => {
  const { product, quantity } = req.body;
  try {
    await productModel.findByIdAndUpdate(
      product,
      {
        $inc: { quantity: -quantity },
      },
      {
        new: true,
        returnDocument: true,
      }
    );
    res.status(200).json({ message: "transaction successfull", success: true });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // If boosting the product, calculate and set the boostEndDate
    if (updateData.boosted && updateData.boostDays) {
      updateData.boostEndDate = new Date(
        Date.now() + updateData.boostDays * 24 * 60 * 60 * 1000
      );
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    await productModel.deleteOne({ _id: productId });
    return res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    next(error);
  }
};

const searchProductByUser = async (req, res, next) => {
  try {
    const searchedProduct = await productModel.find({
      $or: [
        {
          name: { $regex: req.query.search, $options: "i" },
        },
        { desc: { $regex: req.query.search, $options: "i" } },
      ],
    });

    res.status(200).json({ message: searchedProduct, success: true });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createProduct,
  reduceQuantityOfProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProductByUser,
};
