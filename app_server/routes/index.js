var express = require('express');
var router = express.Router();
var ctrMain = require('../controllers/blog');


router.get('/', ctrMain.index);
router.get('/blogList', ctrMain.blogList);

router.get('/blogAdd', ctrMain.getBlogAdd);
router.post('/blogAdd', ctrMain.postBlogAdd);

router.get('/blogEdit/:blogid', ctrMain.getBlogEdit);
router.post('/blogEdit/:blogid', ctrMain.postBlogEdit);

router.get('/blogDelete/:blogid', ctrMain.getBlogDelete);
router.post('/blogDelete/:blogid', ctrMain.postBlogDelete);

var port = process.env.PORT || 80;
module.exports = router;
