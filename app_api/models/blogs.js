    
var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
 blogTitle: {type: String, required: true },
 blogText: String,
 blogAuthor: {type: String, required: true },
 blogEmail: {type: String, required: true},
 dateOfCreation: { type: Date, "default": Date.now },
 blogFav: {type: Number, required: true, "default":0 }
});

mongoose.model('Blog', blogSchema);
