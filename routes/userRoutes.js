const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser, checkIfUserExists,userLogin } = require('../controllers/userController');

// Create a new user
router.post('/register', createUser);

// Get all users
router.get('/getUsers', getUsers);

// Get a single user by ID
router.get('/getUserById/:userId', getUserById);

// Update a user by ID
router.put('/updateUser/:userId', updateUser);

// Delete a user by ID
router.delete('/deleteUser/:userId', deleteUser);

// Check if user exists by email
router.post('/check', checkIfUserExists);

// User Login
router.post('/userLogin', userLogin);

module.exports = router;
