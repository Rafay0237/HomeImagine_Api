const express = require('express');
const router = express.Router();

const {saveContract,deleteContract,getContract,getSentContractsPro,getOnGoingContractsPro,
    getSentContractsClient,getOnGoingContractsClient,acceptContract
,getPaymentsHistoryClient,getPaymentsHistoryPro} =require("../controllers/contract")



router.post('/create/', saveContract); 

router.get('/:contractId', getContract); 

router.get('/sent-pro/:proId', getSentContractsPro); 

router.get('/sent-client/:clientId', getSentContractsClient); 

router.get('/ongoing-pro/:proId', getOnGoingContractsPro); 

router.get('/ongoing-client/:clientId', getOnGoingContractsClient); 

router.put('/:contractId', acceptContract); 

router.delete('/:id', deleteContract); 

router.get("/payment-history-pro/:proId",getOnGoingContractsPro)

router.get("/payment-history-client/:userId",getPaymentsHistoryClient)


module.exports = router;