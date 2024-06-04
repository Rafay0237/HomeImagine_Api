const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  contractId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  proId: {
    type: String,
    required: true,
  },
   proName: {
    type: String,
    required:true
  },
  proDp: {
    type: String,
    default:"https://th.bing.com/th/id/OIP.Icb6-bPoeUmXadkNJbDP4QHaHa?w=500&h=500&rs=1&pid=ImgDetMain"
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  ratingGiven: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
