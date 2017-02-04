/*
Requirements:

COLLECTIONS:

image collection

queries collection that saves every query string with a timestamp

ROUTES:

imagesearch route: api/imagesearch/
with a query string that searches the db for the given parameters
it returns 10 records in JSON
may also include ?offset= which returns records starting at the
given index number
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

app.get('/api/imagesearch/:search', function(req, res) {
    var searchTerms = req.params.search.split(' ');
    var offset = req.query.offset;
    console.log(searchTerms);
    // console.log('queryString', queryString);
    // res.send('image search route');

    // Create an array of regular expressions out of searchTerms
    var searchTermsExp = searchTerms.map(function(searchTerm) {
        return new RegExp(searchTerm, 'i');
    });

    // Use the search term regex array to search every field in the image db
    Image.find({ $or: [
            { url: { $in: searchTermsExp } },
            { snippet: { $in: searchTermsExp } },
            { thumbnail: { $in: searchTermsExp } },
            { context: { $in: searchTermsExp } }
        ]}, function(err, image) {
            if (err) {
                console.log(err);
            } else {
                console.log(image);
            }
        });
});

app.get('/api/latest/imagesearch/', function(req, res) {
    // res.send('latest query route');
});

// Helper function used to create image records
// keep commented out for normal usage
// Image.create({
//     url: "https://i.ytimg.com/vi/-OSSDuMkk70/hqdefault.jpg",
//     snippet: "Funny Dogs - A Funny Dog ...",
//     thumbnail: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSFiJfN301Cg9qKMVjkNBkfOk6TS7-OJ9pMNeayEEjm4tG3bzw1kWNukFY",
//     context: "https://www.youtube.com/watch?v=-OSSDuMkk70"
// }, function(err, image) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('newly created image');
//         console.log(image);
//     }
// });

// use process.env.PORT for compatibility with heroku
app.listen(process.env.PORT || 3000, function() {
    console.log('Server started');
});
