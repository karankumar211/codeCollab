const app = require("express").Router();
const {
  createSnippet,
  getSnippetBySpace,
  getSnippetById,
  updateSnippet,
} = require("../controllers/snippet.controller");
const authMiddleware = require("../middlewares/user.middleware");
// routes
app.post("/createSnippet", authMiddleware, createSnippet);
app.get("/space/:spaceId", authMiddleware, getSnippetBySpace);
app.get("/:snippetId", authMiddleware, getSnippetById);
app.put("/:snippetId", authMiddleware, updateSnippet);
module.exports = app;
