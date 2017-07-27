var mongoose = require("mongoose");

// Campground Schema & Model Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

module.exports = mongoose.model("Campground", campgroundSchema);
