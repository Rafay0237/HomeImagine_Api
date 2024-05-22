const Products =require("../models/product");


const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Products.findById({_id:id});
      if (!product) {
        return res.status(404).json({ message: 'Product not found' ,found:false});
      }
      res.status(200).json({product,found:true});
    } catch (error) {
      res.status(500).json({ error:error.message, found:false });
    }
  };

  const createProduct = async (req, res) => {
    const { title, img, rating, price, reviewCount, category } = req.body;
    try {
      const newProduct = new Products({ title, img, rating, price, reviewCount, category });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
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
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  };
  
  const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  };

const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Products.find({ category });
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category',found:false });
    }
    res.status(200).json({products,found:true});
  } catch (error) {
    res.status(500).json({ message: error.message ,found:false });
  }
};

module.exports = {
  getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
  getProductsByCategory
};
  