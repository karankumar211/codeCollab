const mongoose = require("mongoose");
const User = require("./user.model");

// creatig model ;
const SpaceSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

module.exports = mongoose.model("Space", SpaceSchema);
