// name , content , language, owner, parentSpace , createdAt, updatedAt
const mongoose = require("mongoose");
const User = require("./user.model");
const space = require("./space.model");
const snippetSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      reuired: true,
    },
    content: {
      type: "string",
      default: "",
    },
    language: {
      type: "string",
      default: "javascript",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentSpace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Snippet", snippetSchema);
