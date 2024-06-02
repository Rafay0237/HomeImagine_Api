const Contract=require("../models/contract")


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
        return res.status(404).json({ message: "Contract not found",delted:false });
      }

      res.status(200).json({ message: "Contract deleted successfully", deleted:true });
    } catch (error) {
      res.status(500).json({ message: error.message ,deleted:false});
    }
  };


  module.exports={saveContract,deleteContract}