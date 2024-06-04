const mongoose = require('mongoose');

const reviewContractSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userDp: {
    type: String,
    required: true
  },
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  proId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ReviewContract = mongoose.model('ReviewContract', reviewContractSchema);

module.exports = ReviewContract;
