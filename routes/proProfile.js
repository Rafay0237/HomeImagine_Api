const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/proProfile");

router.post("/build-profile", buildProfile);

router.get("/get-profile/:userId", getProfile);

router.get("/get-chatBarData/:userId", getChatBarData);

router.get("/get-profiles/:category", getProfiles);

router.put("/update-profile/", updateProfile);

router.delete("/delete-profile/:userId", deleteProfile);

router.get("/project/:proId", getProjects);

router.delete("/project/:projectId", deleteProject);

router.get("/sliderImages/:proId", getSliderImages);

router.delete("/profile/:proId/index/:index", deleteSliderImages);

module.exports = router;
