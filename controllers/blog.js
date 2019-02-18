/* GETting blog list page */
module.exports.blog = function(req, res) {
  res.render('blog list', { title: 'Blog List' });
};

/* GETting blog add page */

module.exports.blog = function(req, res) {
  res.render('blog add', { title: 'Blog Add' });
};
