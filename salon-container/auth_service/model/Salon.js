const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: false,
    max: 255,
    min: 1,
  },
});

module.exports = mongoose.model("Salon", salonSchema);
