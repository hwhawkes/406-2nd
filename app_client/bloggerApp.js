var app = angular.module('bloggerApp', ['ngRoute']); 
var rue = angular.module('rueApp', ['ngRoute']);

//*** Router Provider ***//
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    })
    .when('/blogList', {
      templateUrl: 'pages/blogList.html',
      controller: 'ListController',
      controllerAs: 'vm'
    })
    .when('/blogAdd', {
      templateUrl: 'pages/blogAdd.html',
      controller: 'AddController',
      controllerAs: 'vm'
    })
    .when('/blogEdit/:id', {
      templateUrl: 'pages/blogEdit.html',
      controller: 'EditController',
      controllerAs: 'vm'
    })
    .when('/blogDelete/:id', {
      templateUrl: 'pages/blogDelete.html',
      controller: 'DeleteController',
      controllerAs: 'vm'
    })
    .when('/register', {
      templateUrl: 'pages/register.html',
      controller: 'RegisterController',
      controllerAs: 'vm'
    })
    .when('/login', {
      templateUrl: 'pages/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })
    .when('/projects', {
	templateUrl: 'pages/projects.html',
	controller: 'ProjectController',
	controllerAs: 'vm'
    })
    .when('/resume', {
        templateUrl: 'pages/resume.html',
        controller: 'ResumeController',
        controllerAs: 'vm'
    })
    .when('/boxgame', {
	templateURL: 'pages/boxgame.html',
	controller: 'GameController',
	controllerAs: 'vm'
    })
    .when('/rate', {
	templateURL: 'pages/rate.html',
	controller: 'RateController',
	controllerAs: 'vm'
    })
    .otherwise({ redirectTo: '/' });
}
);

rue.config(function ($routeProvider) {
  $routeProvider
    .when('/rueprect', {
      templateUrl: 'pages/rueprect.html',
      controller: 'RueController',
      controllerAs: 'vm'
    })
    .otherwise({ redirectTo: '/rueprect' });
}
);




// REST Web API functions
function getAllBlogs($http) {
  return $http.get('/api/blogs');
}

function addBlog($http, data, authentication) {
  console.log( { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
  return $http.post('/api/blogs/', data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function getBlogById($http, id) {
  return $http.get('/api/blogs/' + id);
}

function updateBlogById($http, id, data, authentication) {
  return $http.put('/api/blogs/' + id, data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function deleteBlogById($http, id, authentication) {
  return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}


app.controller('HomeController', function HomeController() {
  var vm = this;
  vm.pageHeader = {
    title: "Hello!"
  };
  vm.message = "Welcome to my website!";
});


app.controller('ListController', ['$http','authentication','$interval',function ListController($http, authentication, $interval) {
  var vm = this;

  vm.pageHeader = {
    title: "Blogs List"
  };
  
  if(authentication.isLoggedIn()){
    vm.userEmail =   authentication.currentUser().email;
  }
  vm.isLoggedIn = function(){
    return authentication.isLoggedIn();
  }
    
  getAllBlogs($http)
    .success(function (data) {
      vm.blogs = data;
      vm.message = "Blogs data found!";
    })
    .error(function (e) {
      vm.message = "Could not get list";
  });
  
  //increments a blog's favorite count
  vm.incrementFavorite = function (blogId, fav ){
    console.log( "favorite is called");
    
    getBlogById($http, blogId)
    .success(function (data) {

      if (fav == "fav" && authentication.isLoggedIn()){
        data.blogFav++;
      }
      vm.message = "Blog data found!";
      updateBlogById($http, data._id, data, authentication)
      .success(function (data) {
        vm.message = "Blog data updated.";
      })
      .error(function (e) {
        vm.message = "Could not update blog given id of " + blogId;
      });
    })
    .error(function (e) {
      vm.message = "Could not get blog given id of" + blogId;
    });

  }

  // refreshes bloglist page
  vm.callAtInterval = function() {

    getAllBlogs($http)
      .success(function (data) {
        vm.blogs = data;
        vm.blogs.forEach(function(blog){
          var dateObj = new Date(blog.dateOfCreation);
          blog.dateOfCreationFormated = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
        });
      })							  
  }
  $interval( function(){vm.callAtInterval();}, 1500, 0, true);

}]);


app.controller('AddController', ['$http', '$location','authentication', function AddController($http, $location,authentication) {
 
  var vm = this;
  vm.blog = {}
  vm.pageHeader = {
    title: "Add Blog"
  };

  vm.submit = function () {
    var data = vm.blog;

    data.blogTitle = addForm.blogTitle.value;
    data.blogText = addForm.blogText.value;
    data.blogAuthor = authentication.currentUser().name;
    data.blogEmail = authentication.currentUser().email;
 
    console.log({ headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
    addBlog($http, data, authentication)
      .success(function (data) {
        vm.message = "data added.";
        $location.path('/blogList').replace();
      })
      .error(function (e) {
        vm.message = "Could not add blog given id of" + addForm.blogTitle.text + " " + addForm.blogText.text;
      });
  }
}]);


app.controller('EditController', ['$http', '$routeParams', '$location','authentication', function EditController($http, $routeParams, $location, authentication) {
  var vm = this;
  vm.blog = {}; // Start with a blank book
  vm.id = $routeParams.id; // Get id from $routParams which must be injected and passed into controller
  vm.pageHeader = {
    title: "Blog Edit"
  };

  // Get data so it may be displayed on edit page
  getBlogById($http, vm.id)
    .success(function (data) {
      vm.blog = data;
      vm.message = "Blog data found!";
    })
    .error(function (e) {
      vm.message = "Could not get blog given id of" + vm.id;
    });

  // Submit function attached to ViewModel for use in form
  vm.submit = function () {
    var data = vm.blog;
    data.blogTitle = editForm.blogTitle.value;
    data.blogText = editForm.blogText.value;

    updateBlogById($http, vm.id, data, authentication)
      .success(function (data) {
        vm.message = "Blog data updated.";
        $location.path('/blogList').replace();
      })
      .error(function (e) {
        vm.message = "Could not update blog given id of " + vm.id + editForm.blogTitle.text + " " + editForm.blogText.text;
      });
  }
}]);


app.controller('DeleteController', ['$http', '$routeParams', '$location','authentication', function DeleteController($http, $routeParams, $location, authentication) {

  var vm = this;
  vm.blog = {};
  vm.id = $routeParams.id;
  vm.pageHeader = {
    title: "Blog Delete"
  };
  getBlogById($http, vm.id)
    .success(function (data) {
      vm.blog = data;
      vm.messsage = "Blog data found.";
    })
    .error(function (e) {
      vm.message = "Could not get blog with id of " + vm.id;
    });
    console.log("test test");
 
  vm.submit = function () {
    deleteBlogById($http, vm.id, authentication)
      .success(function (data) {
        vm.message = "Blog deleted.";
        $location.path('/blogList').replace();
      })
      .error(function (e) {
        vm.message = "Could not delete blog with id of " + vm.id;
      });
  }
}]);


app.controller('ProjectController', function ProjectController() {
  var vm = this;
  vm.pageHeader = {
    title: "Projects"
  };
  vm.message = "These are my projects.";
});


app.controller('ResumeController', function ResumeController() {
  var vm = this;
  vm.pageHeader = {
    title: "Resume"
  };
  vm.message = "This is my resume.";
});


app.controller('GameController', function GameController() {
  var vm = this;
  vm.pageHeader = {
    title: "Box Game"
  };
  vm.message = "Welcome to the BOX GAME";
});

app.controller('RateController', function RateController($ratings) {
  var vm = this;
  vm.genRating = $ratings.getRating;
  vm.pageHeader = {
    title: "Rate my website"
  };
  vm.message = "These are my ratings.";
});



rue.controller('RueController', function RueController() {
  var vm = this;
  vm.pageHeader = {
    title: "Hello!"
  };
  vm.message = "These are my clips BOIIII";
});



