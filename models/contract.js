const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contractSchema = new Schema(
  {
    intro: {
      date: { type: Date, required: true },
      description: { type: String, required: true },
    },
    deliverables: {
      type: String,
      required: true,
    },
    proId: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    payment: {
      total: { type: Number, required: true },
      paymentSchedule: { type: String, required: true },
    },
    deadline: {
      type: Date,
      required: true,
    },
    termination: {
      conditions: { type: String, required: true },
      paymentOnTermination: { type: String, required: true },
    },
    accepted:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model("contract", contractSchema);

module.exports = Contract;
