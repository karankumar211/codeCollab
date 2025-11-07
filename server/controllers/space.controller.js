// By convention, Mongoose models are capitalized
const Space = require("../models/space.model");
const User = require("../models/user.model");

// 1) task to create spaces
const createSpace = async (req, res) => {
  const { name } = req.body;
  const owner = req.user.id; // getting from the auth middleware
  const members = [owner]; // The owner is always the first member

  if (!name) {
    return res.status(400).json({ message: "Space name is required" });
  }

  try {
    // Use the capitalized model name
    const newSpace = new Space({ name, owner, members });
    await newSpace.save();
    return res
      .status(201)
      .json({ message: "Space created successfully", space: newSpace });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

const getSpaces = async (req, res) => {
  const userId = req.user.id; // getting from auth middleware
  try {
    // Simplified Query: Since your createSpace logic *always*
    // adds the owner to the members array, we only need to
    // find spaces where the user is in the 'members' list.
    const spaces = await Space.find({ members: userId });

    if (!spaces || spaces.length === 0) {
      return res.status(404).json({ message: "No spaces found for this user" });
    }
    return res.status(200).json({ spaces });
  } catch (e) {
    console.error("Error in getSpaces:", e);
    return res.status(500).json({ message: "server error", error: e.message });
  }
};

const inviteUserToSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { email } = req.body;
    const inviterId = req.user.id;

    // Use the capitalized model name
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // This security check is correct
    if (!space.owner.equals(inviterId)) {
      return res
        .status(403)
        .json({ message: "Only the space owner can invite members" });
    }

    // Use the capitalized model name
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res
        .status(404)
        .json({ message: "User with that email not found" });
    }

    // This check is correct
    const isAlreadyMember = space.members.some((memberId) =>
      memberId.equals(userToInvite._id)
    );
    if (isAlreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    space.members.push(userToInvite._id);
    await space.save();

    res.status(200).json({ message: "User invited successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { createSpace, getSpaces, inviteUserToSpace };