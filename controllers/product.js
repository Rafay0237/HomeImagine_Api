const Products = require("../models/product");
const ShippingAddress = require("../models/shippingAddress");
var validator = require("email-validator");

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findById({ _id: id });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", found: false });
    }
    res.status(200).json({ product, found: true });
  } catch (error) {
    res.status(500).json({ error: error.message, found: false });
  }
};

const createProduct = async (req, res) => {
  const { title, img, rating, price, reviewCount, category } = req.body;
  try {
    const newProduct = new Products({
      title,
      img,
      rating,
      price,
      reviewCount,
      category,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, img, rating, price, reviewCount, category } = req.body;
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { title, img, rating, price, reviewCount, category },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Products.find({ category });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category", found: false });
    }
    res.status(200).json({ products, found: true });
  } catch (error) {
    res.status(500).json({ message: error.message, found: false });
  }
};

const saveShippingAddress = async (req, res) => {
  try {
    const { address, city, email, fullName, houseNu, phoneNu, userId } = req.body;

    if (!address || !city || !email || !fullName || !houseNu || !phoneNu || !userId) {
      return res.status(400).json({ message: 'All fields are required', success: false });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({ message: 'Invalid email format', success: false });
    }

    const existingAddress = await ShippingAddress.findOne({ userId });
    if (existingAddress) {
      const updatedShippingAddress = await ShippingAddress.findOneAndUpdate(
        { userId },
        { address, city, email, fullName, houseNu, phoneNu },
        { new: true, runValidators: true }
      );

      if (!updatedShippingAddress) {
        return res.status(400).json({ message: 'Failed to update shipping address', success: false });
      }

      return res.status(200).json({ message: 'Shipping address updated successfully', success: true});
    } else {
      const newShippingAddress = new ShippingAddress(req.body);

      const savedSuccess = await newShippingAddress.save();

      if (!savedSuccess) {
        return res.status(400).json({ message: 'Failed to save shipping address', success: false });
      }

      return res.status(201).json({ message: 'Shipping address created successfully', success: true, data: savedSuccess });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const checkShippingAddressExists = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressFound = await ShippingAddress.findOne({ userId });

    if (!addressFound) {
      return res.status(404).json({ message: 'Shipping address is required!', found: false });
    }

    return res.status(200).json({ message: 'Shipping address found', found: true});
  } catch (error) {
    return res.status(500).json({ message:error.message  ,found:false});
  }
};

module.exports = {
  getProductById,
  //   createProduct,
  //   updateProduct,
  //   deleteProduct,
  getProductsByCategory,
  saveShippingAddress,
  checkShippingAddressExists
};
