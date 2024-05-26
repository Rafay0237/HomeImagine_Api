const Proposals = require("../models/proposal");
const Conversations =require("../models/conversation");

let sendProposal = async (req, res) => {
  let {senderId,userId}=req.body
  try {
    let proposalExists= Proposals.findOne({
      $and: [
        { senderId: senderId },
        { userId: userId }
    ]
    })
    if(proposalExists)
    return res.status(200).send({message:"Proposal is already sent!"})

    let newProposal = await new Proposals(req.body);
    await newProposal.save();
    return res.status(200).send({ message: "Proposal Sent!" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err.toString() });
  }
};

let getProposals = async (req, res) => {
    let {userId}=req.params
  try {
    let proposals=await Proposals.find({userId})
    if(!proposals)
    return res.status(404).send({ found:false});

    return res.status(200).send({ proposals,found:true});
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err.toString() ,found:false});
  }
}; 

let acceptProposal = async (req, res) => {
  try {
    let {senderId,userId}=req.body
    let convoExist=await Conversations.findOne({
      members:{$all: [userId,senderId]}
    })
    if(convoExist)
    return res.status(200).send({message:"Conversation Already Exists.",accepted:false})
  
  let newConvo=await new Conversations({members:[userId,senderId]})
  await newConvo.save()
  await Proposals.deleteOne({ senderId, userId })
  return res.status(200).send({message:"Proposal Accepted",accepted:true})

  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err.toString(),accepted:false });
  }
};

let deleteProposal = async (req, res) => {
  let {senderId,userId}=req.body
  try {
    const deleteResult = await Proposals.deleteOne({ senderId, userId });

    if (deleteResult.deletedCount === 0) {
        return res.status(404).send({ deleted:false,message: 'Proposal not found.' });
    }
    return res.status(200).send({deleted:true,message: 'Proposal deleted.' });

  } catch (err) {
    return res.status(500).send({ error: err.toString() ,deleted:false});
  }
};

module.exports={sendProposal,acceptProposal,deleteProposal,getProposals}
