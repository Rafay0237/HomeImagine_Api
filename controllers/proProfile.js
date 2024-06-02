const proProfile = require("../models/proProfile");
const Users = require("../models/user");

let buildProfile = async (req, res) => {
  let { userId } = req.body;
  let profile = req.body;
  try {
    let user = await Users.findOne({ _id: userId });
    if (!user) return res.status(404).send({ message: "User Id not Found!" });

    let userProfile = await proProfile.findOne({ userId });
    if (userProfile)
      return res.status(400).send({ message: "User Profile already exists!" });

    let newProfile = new proProfile(profile);
    let savedProfile = await newProfile.save();
    return res
      .status(200)
      .send({ message: "New Profile Created!", savedProfile });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

let getChatBarData = async (req, res) => {
  let { userId } = req.params;
  try {
    let user = await Users.findOne({ _id: userId });
    if (!user) return res.status(200).send({ found: false });
    return res
      .status(200)
      .send({
        profilePicture: user.profilePicture,
        userName: user.userName,
        freindId:user._id
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.toString() });
  }
};

let getProfile = async (req, res) => {
  let { userId } = req.params;

  try {
    let userProfile = await proProfile.findOne({ userId });
    if (!userProfile) return res.status(200).send({ found: false });
    return res.status(200).send({ userProfile });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.toString() });
  }
};

let getProfiles = async (req, res) => {
  let { category } = req.params;
  try {
    let userProfiles = await proProfile.find({ category });
    if (!userProfiles || userProfiles.length === 0)
      return res.status(200).send({ found: false });

    return res.status(200).send({ userProfiles, found: true });
  } catch (error) {
    res.status(500).send({ error: error.toString(), found: false });
  }
};

let deleteProfile = async (req, res) => {
  let { userId } = req.params;

  try {
    let deletedProfile = await proProfile.deleteOne({ userId });
    if (!deletedProfile)
      return res.status(404).send({ message: "User Profile not Found!" });
    return res.status(200).send({ deletedProfile });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

let updateProfile = async (req, res) => {
  let { userId } = req.body;

  try {
    let userProfile = await proProfile.findOne({ userId });
    if (!userProfile)
      return res.status(404).send({ message: "User Profile not Found!" });

    let updatedProfile = await proProfile.findByIdAndUpdate(
      userProfile._id,
      req.body,
      { new: true }
    );
    return res.status(200).send(updatedProfile);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

module.exports = {
  buildProfile,
  getProfile,
  getProfiles,
  deleteProfile,
  updateProfile,
  getChatBarData
};
