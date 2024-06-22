const proProfile = require("../models/proProfile");
const Users = require("../models/user");
const Project =require ("../models/project")

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
    return res.status(200).send({ userProfile ,found:true});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.toString(),found:false });
  }
};

let getProfiles = async (req, res) => {
  let { category } = req.params;
  try {
    let userProfiles = await proProfile.find({ category });
    if (!userProfiles || userProfiles.length === 0)
      return res.status(200).send({ found: false });

     res.status(200).send({ userProfiles, found: true });
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

let getProjects = async (req, res) => {
const { proId } = req.params;
  try {
    const projects = await Project.find({ proId});
    if (projects && projects.length!==0) {
      res.json({ found: true, projects });
    } else {
      res.json({ found: false ,message:"No projects are posted by you currently" });
    }
  } catch (error) {
    res.status(500).json({ found: false, message: error.message });
  }
}

let deleteProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete( projectId );
    if (deletedProject) {
      res.json({ deleted: true, message: "Project deleted successfully" });
    } else {
      res.json({ deleted: false, message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ deleted: false, message: error.message });
  }
};


let getSliderImages = async (req, res) => {
try {
  const { proId } = req.params;
  const profile = await proProfile.findOne({userId:proId})
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' ,success:false });
  }
  res.status(200).json({sliderImages:profile.sliderImages ,success:true});
} catch (error) {
  res.status(500).json({ message: error.message ,success:false });
}
};

let deleteSliderImages = async (req, res) => {
const { proId, index } = req.params;

    try {
        const imageIndex = parseInt(index);

        const profile = await proProfile.findOne({userId:proId});

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found',deleted:false });
        }

        if (imageIndex < 0 || imageIndex >= profile.sliderImages.length) {
            return res.status(400).json({ message: 'Index out of bounds',deleted:false  });
        }

        profile.sliderImages.splice(imageIndex, 1);

        await profile.save();

        res.status(200).json({ message: 'Image deleted successfully',deleted:true });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: error.message,deleted:false });
    }
  }

module.exports = {
  buildProfile,
  getProfile,
  getProfiles,
  deleteProfile,
  updateProfile,
  getChatBarData,
  getProjects,
  getSliderImages,
  deleteSliderImages,
  deleteProject
};
