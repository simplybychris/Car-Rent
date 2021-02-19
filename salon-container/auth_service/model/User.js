const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    max: 255,
    min: 4,
  },
  last_name: {
    type: String,
    required: true,
    max: 255,
    min: 4,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 4,
  },
  address: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  PESEL: {
    type: Number,
    required: true,
  },
});

userSchema.statics.findAll = function () {
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

module.exports = mongoose.model("User", userSchema);
