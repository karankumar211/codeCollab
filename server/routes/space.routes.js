const app = require("express").Router();
const { createSpace, getSpaces, inviteUserToSpace } = require("../controllers/space.controller");
const authMiddleware = require("../middlewares/user.middleware");

// route to create space
app.post("/createSpace",authMiddleware, createSpace);

// route to get all spaces of the user
app.get("/getSpace", authMiddleware, getSpaces);

app.post("/:spaceId/invite", authMiddleware, inviteUserToSpace);
module.exports = app;