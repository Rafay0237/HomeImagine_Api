const express = require("express");
const router = express.Router();

const {
  saveContract,
  deleteContract,
  getContract,
  getSentContractsPro,
  getOnGoingContractsPro,
  getSentContractsClient,
  getOnGoingContractsClient,
  acceptContract,
  getPaymentsHistoryClient,
  getPaymentsHistoryPro,
  getPaymentData,
  updateContractRating,
  getProReviews,
} = require("../controllers/contract");

router.post("/create/", saveContract);

router.get("/:contractId", getContract);

router.get("/sent-pro/:proId", getSentContractsPro);

router.get("/sent-client/:clientId", getSentContractsClient);

router.get("/ongoing-pro/:proId", getOnGoingContractsPro);

router.get("/ongoing-client/:clientId", getOnGoingContractsClient);

router.put("/:contractId", acceptContract);

router.delete("/:id", deleteContract);

router.get("/payment-history-pro/:proId", getPaymentsHistoryPro);

router.get("/payment-history-client/:userId", getPaymentsHistoryClient);

router.get("/payment/:paymentId", getPaymentData);

router.post("/review", updateContractRating);

router.get("/reviews/:proId", getProReviews);

module.exports = router;
