const users = require("../models/user");
const Messages = require("../models/message");
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
  const updatedUser = await users.findByIdAndUpdate(
    userId,
    { profilePicture: URL },
    { new: true }
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

module.exports = { uploadImageDp ,uploadImageChat};
