var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 
var auth = jwt({   // Lab 6
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlBlogs = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');  // Lab 6

/* Setup routes to API URLs */
router.get('/blogs', ctrlBlogs.blogsList);
router.post('/blogs', auth, ctrlBlogs.blogsCreate);   // Lab 6 - added auth param
router.get('/blogs/:blogid', ctrlBlogs.blogsReadOne);
router.put('/blogs/:blogid', auth, ctrlBlogs.blogsUpdateOne);  // Lab 6 - added auth param
router.delete('/blogs/:blogid', auth, ctrlBlogs.blogsDeleteOne); // Lab 6 - added auth param
router.post('/register', ctrlAuth.register);  // Lab 6
router.post('/login', ctrlAuth.login);  // Lab 6

module.exports = router;
