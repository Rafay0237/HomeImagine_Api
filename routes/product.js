const express = require('express');
const router = express.Router();
const {
  getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
  getProductsByCategory,
  saveShippingAddress,
  checkShippingAddressExists,
  updateProductRating,
  searchProducts
} = require('../controllers/product');

router.get('/:id', getProductById);

router.get('/category/:category', getProductsByCategory); 

router.post('/shipping-address', saveShippingAddress); 

router.get('/shipping-address/:userId', checkShippingAddressExists); 

router.post('/review', updateProductRating); 

router.get('/search/:search', searchProducts); 

// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);


module.exports = router;
