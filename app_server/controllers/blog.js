var request = require('request');
//URL 
var apiOptions = {
  server : "http://localhost:80"
};


var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Can't find this page";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "There is a problem with our server.";
  } else {
    title = status;
    content = "Something went wrong";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

/* GETting index  page */
module.exports.index = function(req, res){
  res.render('index' );
};

module.exports.blogList = function(req, res){
  var requestOptions, path;
  path = '/api/blogs';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var i, data;
      data = body;
      renderHomepage(req, res, data);
    }
    );
};

var renderHomepage = function(req, res, responseBody){
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }
  res.render('blogList', {
    blogs: responseBody
  });
};

/* GETting blog form */
module.exports.getBlogAdd= function(req, res){
  res.render('blogAdd' );
};

//POSTing blog
module.exports.postBlogAdd=function(req, res){

  var requestOptions, path;
  path = "/api/blogs/";

  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : {
     blogTitle: req.body.blogTitle,
     blogText: req.body.blogText
   }
 };

 console.log("path = " + path ); 

 request(
  requestOptions,
  function(err, response, body) {
    console.log("new post body = " + JSON.stringify (body) );
    if ( response.statusCode== 201){
      res.redirect('/blogList');
      console.log("new post body = " + JSON.stringify (body) );
    } else{
      _showError(req, res, response.statusCode);
    }
  }
  );
};

    
module.exports.getBlogEdit = function (req, res) {
  var requestOptions, path;

  path = "/api/blogs/" + req.params.blogid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };

  request(
    requestOptions,
    function(err, response, body) {
      res.render('blogEdit', {
        blog : body
      });
    });
};

// blog edit
module.exports.postBlogEdit = function (req, res) {
  console.log("postBlogEdit is called and res.body = " + JSON.stringify (req.body) +" req.body.blogTitle = "+ req.body.blogTitle +" req.body.blogText"+ req.body.blogText+ " req.params.blogid = " + req.params.blogid);

  var requestOptions, path, postdata;
  var blogid = req.params.blogid;

  path = '/api/blogs/' + blogid;
  postdata = {
    blogTitle : req.body.blogTitle,
    blogText : req.body.blogText
  };
  requestOptions = {
    url : apiOptions.server + path,
    method : "PUT",
    json : postdata
  };

  request(
    requestOptions,
    function(err, response, body) {
       console.log("body = " + JSON.stringify (body));
       console.log("response.statusCode = " + response.statusCode);
      if (response.statusCode === 200) {
        res.redirect('/blogList');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
};

module.exports.getBlogDelete= function(req, res){
  console.log(" req.params.blogid = " + req.params.blogid );

  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      res.render('blogDelete', {
        blog : body
      });
    }
  );

};

/* GETting delete page */
module.exports.postBlogDelete= function(req, res){
  console.log(" req.params.blogid = " + req.params.blogid );

  var requestOptions, path;
  path = "/api/blogs/" + req.params.blogid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "DELETE",
    json : {}
  };

  request(
    requestOptions,
    function(err, response, body) {
       console.log("body = " + JSON.stringify (body));
       console.log("response.statusCode = " + response.statusCode);
      if (response.statusCode === 204) {
        res.redirect('/blogList');
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );

};
