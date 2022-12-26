const express = require('express');
const router = express.Router();

const { createUser, loginUser } = require('../controllers/userController.js');
const { createPost, getAllPosts, updatepost, deletePost, findActiveOrInactive } = require('../controllers/postController.js');
const { authenticate, authorise, authenticateAdmin, authoriseAdmin } = require('../middleware/auth.js');

const { createAdmin, loginAdmin } = require('../controllers/adminController.js');

const { geoLocation } = require('../controllers/geoLocationController.js');

//admin
router.post('/createAdmin', createAdmin);
router.post('/loginAdmin', loginAdmin);

router.put('/updatePostByAdmin/:adminId/:postId', authenticateAdmin, authoriseAdmin, updatepost);
router.delete('/deletePostByAdmin/:adminId/:postId', authenticateAdmin, authoriseAdmin, deletePost);

//user
router.post('/createUser', createUser);
router.post('/loginUser', loginUser);

//post
router.post('/createPost', authenticate, createPost);
router.get('/getAllPosts/:userId', authenticate, authorise, getAllPosts);
router.put('/updatePost/:userId/:postId', authenticate, authorise, updatepost);
router.delete('/deletePost/:userId/:postId', authenticate, authorise, deletePost);

router.get('/findActiveOrInactive', findActiveOrInactive);

//geoLocation
router.get('/geoLocation', geoLocation);

module.exports = router; 