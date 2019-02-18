

/* GETting home page */

module.exports.home = function(req, res) {
  res.render('Home', { title: 'Home' });
};
