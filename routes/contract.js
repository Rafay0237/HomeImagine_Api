const express = require('express');
const router = express.Router();

const {saveContract,deleteContract} =require("../controllers/contract")



router.post('/create/', saveContract); 

// router.get('/:id', getProductsByCategory); 

router.delete('/:id', deleteContract); 




module.exports = router;