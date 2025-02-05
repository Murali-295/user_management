const connection = require('../utility/connection');
const bcryptjs = require('bcryptjs');
const { ObjectId } = require('mongodb'); // Ensure you're using ObjectId when querying by _id

// Create a user
async function createUser(req, res) {
    const { email, username, password } = req.body; // Extract data from req.body

    try {
        const mongo = connection.getDB(); // Get DB instance (already connected)
        const userCollection = mongo.collection('users');

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

        return res.json({ status: "success", message: "User registered successfully.", user: newUser });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error', error: error.message });
    }
}

// Get all users
async function getUsers(req, res) {

    try {
        const mongo = connection.getDB(); // Get DB instance
        const userCollection = mongo.collection('users');

        const users = await userCollection.find().toArray();

        return res.json({ status: "success", users });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error', error: error.message });
    }
}

// Get a single user by ID
async function getUserById(req, res) {
    const { userId } = req.params; // Extract the userId from the route params

    try {
        const mongo = connection.getDB(); // Get DB instance
        const userCollection = mongo.collection('users');

        // Fetch the user by ObjectId
        const user = await userCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.json({ status: "failed", message: "User not found." });
        }

        return res.json({ status: "success", user });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error', error: error.message });
    }
}

// Update a user by ID
async function updateUser(req, res) {
    const { userId } = req.params;
    const { username, email, password } = req.body;

    try {
        const mongo = connection.getDB(); // Get DB instance
        const userCollection = mongo.collection('users');

        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.json({ status: "failed", message: "User not found." });
        }

        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcryptjs.hash(password, 10);
        }
        const updatedUser = { username, email, password: hashedPassword };
        await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });

        return res.json({ status: "success", message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error); 
        res.json({ message: 'Server error', error: error.message });
    }
}

// Delete a user by ID
async function deleteUser(req, res) {
    const { userId } = req.params;

    try {
        const mongo = connection.getDB(); // Get DB instance
        const userCollection = mongo.collection('users');

        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.json({ status: "failed", message: "User not found." });
        }

        await userCollection.deleteOne({ _id: new ObjectId(userId) });

        return res.json({ status: "success", message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error', error: error.message });
    }
}

// Check if user exists by email
async function checkIfUserExists(req, res) {
    const { email } = req.body;

    try {
        const mongo = connection.getDB(); // Get DB instance
        const userCollection = mongo.collection('users');

        // Check if user exists by email
        const user = await userCollection.findOne({ email });
        if (user) {
            return res.json({ status: "success", message: "User exists." });
        } else {
            return res.json({ status: "failed", message: "User not found." });
        }
    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error', error: error.message });
    }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, checkIfUserExists };
