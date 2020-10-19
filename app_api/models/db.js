var mongoose = require( 'mongoose');
var dbURI = 'mongodb://dbOwner:password@localhost/blogger';
mongoose.connect( dbURI, {useNewUrlParser: true} );

//monitoring the connection
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err){
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconnected');
});

// shutdown protocol
var gracefulShutdown = function ( msg, callback) {

  mongoose.connention.close(function () { 
    console.log( 'Mongoose disconnected through ' + msg);
    callback();
  });
};

// event listeners

process.once( 'SIGUSR2', function () {
  gracefulShutdown( 'nodemon restart', function() {
    process.exit(0);
  });
});


process.on( 'SIGINT', function () {
  gracefulShutdown( 'app termination', function() {
    process.exit(0);
  });
});


process.on( 'SIGTERM', function () {
  gracefulShutdown( 'Heroku app shutdown', function() {
    process.exit(0);
  });
});

require('./blogs');
require('./user');
