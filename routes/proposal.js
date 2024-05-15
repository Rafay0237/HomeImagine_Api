const express = require("express");
const router = express.Router();
const {
  acceptProposal,
  sendProposal,
  deleteProposal,
  getProposals
} = require("../controllers/proposal");

router.post("/send", sendProposal);

router.get("/get/:userId", getProposals);

router.post("/accept", acceptProposal);

router.delete("/delete", deleteProposal);

module.exports = router;
