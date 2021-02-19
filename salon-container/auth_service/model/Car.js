const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  Brand: {
    type: String,
    required: true,
    max: 255,
    min: 4,
  },
  Model: {
    type: String,
    required: true,
    max: 255,
    min: 4,
  },
  Year: {
    type: Number,
    required: true,
  },
  Capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  RegNumber: {
    type: String,
    required: true,
    max: 8,
    min: 7,
  },
  SalonId: {
    type: String,
    required: false,
    max: 30,
    min: 0,
  },
  CurrentSalonId: {
    type: String,
    required: false,
    max: 30,
    min:0
  }
});

carSchema.statics.findAll = function () {
  return new Promise((resolve, reject) => {
    this.find((error, docs) => {
      if (error) {
        console.error(error);
        return reject(error);
      }
      resolve(docs);
    });
  });
};

module.exports = mongoose.model("Car", carSchema);
