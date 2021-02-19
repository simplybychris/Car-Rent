const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  UserId: {
    type: String,
    required: true,
    max: 255,
    min: 1,
  },
  SalonId: {
    type: Number,
    required: false,
    max: 255,
    min: 1,
  },
});

workerSchema.statics.findAll = function () {
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

module.exports = mongoose.model("Worker", workerSchema);
