const Contract=require("../models/contract")
const Payment = require('../models/payment');


let saveContract=async(req,res)=>{
    const contractData = req.body;
    try {
      if (!contractData.intro || !contractData.deliverables || !contractData.payment ||
          !contractData.deadline || !contractData.termination || !contractData.clientId ||
          !contractData.proId) {
          return  res.status(400).json({ message: "All feilds are required", success:false});
      }
      const contract = await Contract.findOne({ proId:contractData.proId, clientId:contractData.clientId });
      if(contract){
      return res.status(400).json({ message: "Contract Already Exists", success:false});
      }
  
      const newContract = new Contract({
        intro: contractData.intro,
        deliverables: contractData.deliverables,
        payment:{ 
          paymentSchedule:contractData.payment.paymentSchedule,
          total:parseFloat(contractData.payment.total)
        },
        deadline: contractData.deadline,
        termination: contractData.termination,
        clientId: contractData.clientId,
        proId: contractData.proId,
      });
  
      let savedContract=await newContract.save();
      if(!savedContract){
      return res.status(400).json({message:"Some Error occurred in Database", success:false});
      }
      res.status(201).json({message:"Contract Send", success:true});
    } catch (error) {
      res.status(400).json({ message: error.message, success:false});
    }
  }

let deleteContract = async (req, res) => {
    const contractId = req.params.id;
  
    try {
      const deletedContract = await Contract.findByIdAndDelete(contractId);
  
      if (!deletedContract) {
        return res.status(404).json({ message: "Contract not found",deleted:false });
      }

      res.status(200).json({ message: "Contract deleted successfully", deleted:true });
    } catch (error) {
      res.status(500).json({ message: error.message ,deleted:false});
    }
  };

  let getSentContractsClient = async (req, res) => {
    const { clientId } = req.params;
    try {
        const contracts = await Contract.find({ clientId, accepted: false });
      
      if (!contracts ||contracts.length===0) {
        return res.status(404).json({ message: 'No Contracts found' ,success:false});
      }
      res.status(200).json({contracts,success:true});
    } catch (error) {
      res.status(500).json({ message: error.message ,success:false});
    }
  };


  let getSentContractsPro = async (req, res) => {
    const { proId } = req.params;
    try {
        const contracts = await Contract.find({ proId, accepted: false });
      
      if (!contracts ||contracts.length===0) {
        return res.status(404).json({ message: 'No Contracts found' ,success:false});
      }
      res.status(200).json({contracts,success:true});
    } catch (error) {
      res.status(500).json({ message: error.message ,success:false});
    }
  };
  

  let getContract = async (req, res) => {
    const { contractId } = req.params;
    try {
      const contract = await Contract.findById(contractId);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' ,success:false});
      }
      res.status(200).json({ contract ,success:true});
    } catch (error) {
      res.status(500).json({ message: error.message ,success:false});
    }
  };
  

  let acceptContract = async (req, res) => {
    const { contractId } = req.params;
    try {
      const contract = await Contract.findByIdAndUpdate(
        contractId,
        { accepted: true },
        { new: true }
      );
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found',success:false });
      }
      res.status(200).json({message: 'Contract Accepted',success:true});
    } catch (error) {
      res.status(500).json({ message: error.message, success:false });
    }
  };

  let getOnGoingContractsClient = async (req, res) => {
    const { clientId } = req.params;
    try {
        const contracts = await Contract.find({ clientId, accepted: true });
      if (!contracts ||contracts.length===0) {
        return res.status(404).json({ message: 'No Contracts found' ,success:false});
      }
      res.status(200).json({contracts,success:true});
    } catch (error) {
      res.status(500).json({ message: error.message ,success:false});
    }
  };

  let getOnGoingContractsPro = async (req, res) => {
    const { proId } = req.params;
    try {
        const contracts = await Contract.find({ proId, accepted: true });
      if (!contracts ||contracts.length===0) {
        return res.status(404).json({ message: 'No Contracts found' ,success:false});
      }
      res.status(200).json({contracts,success:true});
    } catch (error) {
      res.status(500).json({ message: error.message ,success:false});
    }
  };

  const getPaymentsHistoryClient = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const payments = await Payment.find({ userId });
      if (!payments) {
        return res.status(404).send({ message: "No payments found for this user", success: false });
      }
      res.status(200).json({ payments, success: true });
    } catch (error) {
      res.status(500).send({ message: error.message, success: false });
    }
  };


  const getPaymentsHistoryPro = async (req, res) => {
    const { proId } = req.params;
  
    try {
      const payments = await Payment.find({ proId });
      if (!payments) {
        return res.status(404).send({ message: "No payments found for this user", success: false });
      }
      res.status(200).json({ payments, success: true });
    } catch (error) {
      res.status(500).send({ message: error.message, success: false });
    }
  };

  module.exports={saveContract,deleteContract,acceptContract,
    getContract,getSentContractsPro,getOnGoingContractsPro,
    getSentContractsClient,getOnGoingContractsClient 
  ,getPaymentsHistoryClient,getPaymentsHistoryPro}