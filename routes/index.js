var express = require('express');
var router = express.Router();

var controllerHome = require('../controllers/home');
/* var controllerBlog = require('../controllers/blog'); */

/* routes to pages */

router.get('/', controllerHome.home);
/*router.get('/blog', controllerBlog.blog); */

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

*/

module.exports = router;
