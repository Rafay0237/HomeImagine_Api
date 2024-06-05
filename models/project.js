const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
  proId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
