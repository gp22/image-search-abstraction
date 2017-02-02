/*
Requirements:

COLLECTIONS:

image collection

queries collection that saves every query string with a timestamp

ROUTES:

imagesearch route: api/imagesearch/
with a query string that searches the db for the given parameters
it returns 10 records in JSON
may also include ?offset= which returns records starting at the given index number
(ex. ?offset=10 returns records starting at the 10th record)

latest search route: api/latest/imagesearch/
*/

var express = require('express');
var app = express();
var mongoose = require('mongoose');

/*
Use the heroku environment variable MLAB_URI to store the db name and login
Set the variable with the command 'heroku config:set MLAB_URI='
*/
const uri = process.env.MLAB_URI;

// Uncomment this line to verify MLAB_URI in case of connection problems
// console.log('uri:', process.env.MLAB_URI);

mongoose.connect(uri);

// Define schemas for the format of the db records
var imageSchema = new mongoose.Schema({
    url: String,
    snippet: String,
    thumbnail: String,
    context: String
});

var querySchema = new mongoose.Schema({
    term: String,
    when: String
});

var Image = mongoose.model('Image', imageSchema);
var Query = mongoose.model('Query', querySchema);

app.get('/api/imagesearch/:query', function(req, res) {
    var queryString = req.params.query;
    // console.log('queryString', queryString);
    // res.send('image search route');
});

app.get('/api/latest/imagesearch/', function(req, res) {
    // res.send('latest query route');
});

// use process.env.PORT for compatibility with heroku
app.listen(process.env.PORT || 3000, function() {
    console.log('Server started');
});