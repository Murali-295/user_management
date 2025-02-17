const connection = require("../utility/connection");
const bcryptjs = require("bcryptjs");

// Create a user
async function createUser(req, res) {
  const { email, username, password } = req.body; // Extract data from req.body

  try {
    const mongo = connection.getDB(); // Get DB instance (already connected)
    const userCollection = mongo.collection("users");

    // Check if the user already exists
    const user = await userCollection.findOne({ email });
    if (user) {
      return res.json({ status: "failed", message: "User already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user
    const newUser = { username, email, password: hashedPassword };
    await userCollection.insertOne(newUser);

    return res.json({
      status: "success",
      message: "User registered successfully."
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", error: error.message });
  }
}

// Get all users
async function getUsers(req, res) {
    try {
      const mongo = connection.getDB(); // Get DB instance
      const userCollection = mongo.collection("users");
  
      // Fetch users, excluding password
      const users = await userCollection.find({}, { projection: { password: 0 } }).toArray();
  
      return res.json({ users: users });
    } catch (error) {
      console.error(error);
      res.json({ message: "Server error", error: error.message });
    }
  }
  

// Get a single user by ID
async function getUserById(req, res) {
  const { userId } = req.params; // Extract the userId from the route params

  try {
    const mongo = connection.getDB(); // Get DB instance
    const userCollection = mongo.collection("users");

    // Fetch the user by ObjectId
    const user = await userCollection.findOne({_id: connection.getObjectId(userId)}, { projection: { password: 0 } });

    if (!user) {
      return res.json({ status: "failed", message: "User not found." });
    }

    return res.json({ status: "success", user });
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", error: error.message });
  }
}

// Update a user by ID
async function updateUser(req, res) {
  const { id, username, email, password } = req.body;

  try {
    const mongo = connection.getDB(); // Get DB instance
    const userCollection = mongo.collection("users");

    const user = await userCollection.findOne({
      _id: connection.getObjectId(id),
    });
    if (!user) {
      return res.json({ status: "failed", message: "User not found." });
    }

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcryptjs.hash(password, 10);
    }
    const updatedUser = { username, email, password: hashedPassword };
    await userCollection.updateOne({ _id: connection.getObjectId(id) },{ $set: updatedUser });

    return res.json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", error: error.message });
  }
}

// Delete a user by ID
async function deleteUser(req, res) {
  const { userId } = req.params;

  try {
    const mongo = connection.getDB(); // Get DB instance
    const userCollection = mongo.collection("users");

    const user = await userCollection.findOne({
      _id: connection.getObjectId(userId),
    });
    if (!user) {
      return res.json({ status: "failed", message: "User not found." });
    }

    await userCollection.deleteOne({ _id: connection.getObjectId(userId) });

    return res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", error: error.message });
  }
}

// Check if user exists by email
async function checkIfUserExists(req, res) {
  const { email } = req.body;

  try {
    const mongo = connection.getDB(); // Get DB instance
    const userCollection = mongo.collection("users");

    // Check if user exists by email
    const user = await userCollection.findOne({ email });
    if (user) {
      return res.json({ status: "success", message: "User exists." });
    } else {
      return res.json({ status: "failed", message: "User not found." });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", error: error.message });
  }
}

//User Login
async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Connect to the DB
    const mongo = connection.getDB(); // Get DB instance
    const userCollection = mongo.collection("users");

    const user = await userCollection.findOne({ email });
    console.log(user);

    if (!user) {
      return res.json({
        status: "failed",
        message: `No user found with the email: ${email}`,
      });
    }
    // Compare the hashed password
    const passCheck = await bcryptjs.compare(`${password}`, user.password); //password.toString()

    if (passCheck) {
      return res.json({
        status: "success",
        message: `User found with the email: ${email}`,
      });
    } else {
      return res.json({ status: "failed", message: "enter valid password: " });
    }
  } catch (error) {
    console.error("Server error during login:", error);
    res.json({ status: "failed", message: "Server error", err: error.message });
  }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, checkIfUserExists, userLogin};
