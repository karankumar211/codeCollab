const User = require("../models/user.model");
const Snippet = require("../models/snippet.model");
const Space = require("../models/space.model");

//name , content , language, owner
const createSnippet = async (req, res) => {
  const { name, content, language, parentSpace } = req.body;
  const owner = req.user.id; // getting from auth middleware
  if (!name || !parentSpace) {
    return res
      .status(400)
      .json({ message: "Name and Parent Space are required" });
  }
  // check if the user is owner or member of the parent space
  try {
    const space = await Space.findById(parentSpace);
    if (!space) {
      return res.status(404).json({ message: "Parent Space not found" });
    }
    // Check if user is either owner or member
    if (space.owner.toString() !== owner && !space.members.includes(owner)) {
      return res.status(403).json({
        message:
          "You must be an owner or member of the space to create snippets",
      });
    }
    const newSnippet = new Snippet({
      name,
      content: content || "", // Make content optional
      language: language || "plain", // Default language if not provided
      owner,
      parentSpace,
    });
    await newSnippet.save();
    return res
      .status(201)
      .json({ message: "Snippet created successfully", snippet: newSnippet });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

const getSnippetBySpace = async (req, res) => {
  const parentSpace = req.params.spaceId;
  const userId = req.user.id; // getting from auth middleware
  try {
    const space = await Space.findById(parentSpace);
    if (!space) {
      return res.status(404).json({ message: "Parent Space not found" });
    }
    // Check if user is either owner or member
    if (space.owner.toString() !== userId && !space.members.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of the parent space" });
    }
    const snippets = await Snippet.find({ parentSpace });
    return res.status(200).json({ snippets });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

const getSnippetById = async (req, res) => {
  const snippetId = req.params.snippetId;
  const userId = req.user.id;
  try {
    const snippet = await Snippet.findById(snippetId).populate("parentSpace");
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // Check if user has access to the parent space
    const space = snippet.parentSpace;
    if (space.owner.toString() !== userId && !space.members.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You don't have access to this snippet" });
    }
    return res.status(200).json({ snippet });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

const updateSnippet = async (req, res) => {
  // Use req.params.snippetId to match your router
  const snippetId = req.params.snippetId;
  const userId = req.user.id;
  const { name, content, language } = req.body;

  try {
    // --- FIX: Step 1: Find the snippet *first* ---
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // --- FIX: Step 2: Find the parent space *second* ---
    const space = await Space.findById(snippet.parentSpace);
    if (!space) {
      return res.status(404).json({ message: "Parent space not found" });
    }

    // --- Step 3: Now do your security check ---
    const isMember = space.members.some((memberId) => memberId.equals(userId));
    const isOwner = space.owner.equals(userId);

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ message: "You don't have access to this space" });
    }

    // --- Step 4: Update and save ---
    if (name) snippet.name = name;
    if (content !== undefined) snippet.content = content;
    if (language) snippet.language = language;

    await snippet.save();

    // Return the saved snippet (which is what your frontend expects)
    return res.status(200).json(snippet);
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};
module.exports = {
  createSnippet,
  getSnippetBySpace,
  getSnippetById,
  updateSnippet,
};
