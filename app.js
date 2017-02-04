/*
Requirements:

COLLECTIONS:

image collection

queries collection that saves every query string with a timestamp

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
    /*
    Route used to query the image db
    Searches the db for the strings contained in :search
    Returns 10 records in JSON
    May also include ?offset= which returns records starting at the
    given index number
    (ex. ?offset=10 returns records starting at the 10th record)
    */
    var searchTerms = req.params.search.split(' ');
    var offset = req.query.offset ? Number(req.query.offset) : 0;

    // Create an array of regular expressions out of searchTerms
    var searchTermsExp = searchTerms.map(function(searchTerm) {
        return new RegExp(searchTerm, 'i');
    });

    // Use searchTermsExp to search every field in the image db
    // Return results starting at the index given in offset
    Image.find({ $or:
                    [
                        { url: { $in: searchTermsExp } },
                        { snippet: { $in: searchTermsExp } },
                        { thumbnail: { $in: searchTermsExp } },
                        { context: { $in: searchTermsExp } }
                    ]
                }, { _id: 0, __v: 0 }, { skip: offset, limit: 10, },
                function(err, images) {
                    if (err) {
                        console.log(err);
                    } else {
                        var response = {};
                        for (var i = 0; i < images.length; i++) {
                            response[i] = JSON.parse(JSON.stringify(images[i]));
                        }
                        res.send(response);
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
