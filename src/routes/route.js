const express = require('express');
const router = express.Router();

const { createUser, loginUser } = require('../controllers/userController.js');
const { createPost, getAllPosts, updatepost, deletePost, findActiveOrInactive } = require('../controllers/postController.js');
const { authenticate, authorise } = require('../middleware/auth.js');
const { geoLocation } = require('../controllers/geoLocationController.js');

//user
router.post('/createUser', createUser);
router.post('/loginUser', loginUser);

//post
router.post('/createPost/:userId/post', authenticate, createPost);
router.get('/getAllPosts/:postId', authenticate, authorise, getAllPosts);
router.put('/updatePost/:postId', authenticate, authorise, updatepost);
router.delete('/deletePost/:postId', authenticate, authorise, deletePost);

router.get('/findActiveOrInactive', findActiveOrInactive);

//geoLocation
router.get('/geoLocation', geoLocation);

module.exports = router; 