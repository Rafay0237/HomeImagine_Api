const express = require('express');
const router = express.Router();
const {
  getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
  getProductsByCategory
} = require('../controllers/product');

router.get('/:id', getProductById);
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);
router.get('/category/:category', getProductsByCategory); 

module.exports = router;
