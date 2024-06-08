const Users = require("../models/user");
const Messages = require("../models/message");
const Project = require("../models/project");
const proProfile =require("../models/proProfile")
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const updateUserDp = async (userId, URL) => {
  const updatedUser = await Users.findByIdAndUpdate(
    {userId},
    { profilePicture: URL },
    {new:true}
  );
  return updatedUser;
};

const updateUserChat = async (userId,conversationId, URL) => {
  let toSaveMessage = {
    sender: userId,
    conversationId,
    img: URL,
  };
  const message = Messages(toSaveMessage);

  const savedMessage = await message.save();
  return savedMessage;
};

let uploadImageDp = async (req, res) => {
  const userId = req.body.id;
  const dp = req.files["image"][0];

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "demo",
    },
    (error, result) => {
      if (error) {
        console.error("Error processing file upload:", error);
        return res
          .status(500)
          .json({
            error: "Some error occurred, please try again later",
            success: false,
          });
      }

      const updatedUser = updateUserDp(userId, result.secure_url);
      
      if (!updatedUser) {
        return res.status(400).send({ error: updatedUser, success: false });
      }
      res.status(200).json({ url: result.secure_url, success: true });
    }
  );
  streamifier.createReadStream(dp.buffer).pipe(stream);
};

let uploadImageChat = async (req, res) => {
  const userId = req.body.id;
  const conversationId=req.body.conversationId;
  const dp = req.files["image"][0];

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "demo",
    },
    (error, result) => {
      if (error) {
        console.error("Error processing file upload:", error);
        return res
          .status(500)
          .json({
            error:error.message,
            success: false,
          });
      }

      const updatedChat = updateUserChat(userId,conversationId, result.secure_url);

      if (!updatedChat) {
        return res.status(400).send({ error: updatedChat, success: false });
      }
      res.status(200).json({img:result.secure_url,success:true});
    }
  );
  streamifier.createReadStream(dp.buffer).pipe(stream);
};

const postProject = async (proId, name, location, desc, URL) => {
  let toSaveProject = {
    proId,
    name,
    location,
    img: URL,
    desc
  };

  const project = new Project(toSaveProject);

  const savedProject = await project.save();
  return savedProject;
};

let uploadImageAndProject = async (req, res) => {
  const { proId, name, location, desc } = req.body;
  const image = req.files["image"][0];
  
  if( !name|| !proId|| !location|| !desc || !image){
    return res.status(203).json({ message: "All Feilds Are Required!", success: false });
  }

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "projects",
    },
    async (error, result) => {
      if (error) {
        console.error("Error processing file upload:", error);
        return res.status(500).json({
          error: error.message,
          success: false,
        });
      }

      try {
        const updatedProject = await postProject(proId, name, location, desc, result.secure_url);

        if (!updatedProject) {
          return res.status(400).send({ error: updatedProject, success: false });
        }
        res.status(200).json({ img: result.secure_url, success: true });
      } catch (err) {
        res.status(500).json({ error: err.message, success: false });
      }
    }
  );
  streamifier.createReadStream(image.buffer).pipe(stream);
};

const updateProSliderImage = async (proId, URL) => {
  const pro = await proProfile.findOne({userId:proId})
  if (!pro) {
    throw new Error(`Profile with userId ${proId} not found.`);
  }
 
  pro.sliderImages.push(URL)

  const savedProfile = await pro.save();
  return savedProfile;
};

let uploadSliderImage = async (req, res) => {
  const { proId} = req.body;
  const image = req.files["image"][0];
  
  if(!proId){
    return res.status(203).json({ message: "All Feilds Are Required!", success: false });
  }

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "sliderImages",
    },
    async (error, result) => {
      if (error) {
        console.error("Error processing file upload:", error);
        return res.status(500).json({
          message: error.message,
          success: false,
        });
      }

      try {
        const updatedProfile = await updateProSliderImage(proId, result.secure_url);

        if (!updatedProfile) {
          return res.status(400).send({ message: updatedProfile, success: false });
        }
        res.status(200).json({ img: result.secure_url, success: true });
      } catch (err) {
        res.status(500).json({ message: err.message, success: false });
      }
    }
  );
  streamifier.createReadStream(image.buffer).pipe(stream);
};



module.exports = { uploadImageDp ,uploadImageChat,uploadImageAndProject,uploadSliderImage};
