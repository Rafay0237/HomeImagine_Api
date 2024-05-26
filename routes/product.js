const express = require('express');
const router = express.Router();
const {
  getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
  getProductsByCategory,
  saveShippingAddress,
  checkShippingAddressExists
} = require('../controllers/product');

router.get('/:id', getProductById);
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);
router.get('/category/:category', getProductsByCategory); 

router.post('/shipping-address', saveShippingAddress); 

router.get('/shipping-address/:userId', checkShippingAddressExists); 

module.exports = router;
