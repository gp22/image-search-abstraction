/*
Image Search Abstraction Layer
Deployed to: https://gp22-imagesearch.herokuapp.com/
This simple app let's you get the image URLs, alt text and page urls in JSON
format for a set of images relating to a query string.
Example:
https://gp22-imagesearch.herokuapp.com/api/imagesearch/query string
You can paginate through the responses by adding a ?offset=n parameter to the
URL, where n is the starting record number when showing search results.
Example:
https://gp22-imagesearch.herokuapp.com/api/imagesearch/query?offset=10 returns
records starting at the 10th record
You can get a list of the most recently submitted search strings in JSON format
by going to:
https://gp22-imagesearch.herokuapp.com/api/latest/imagesearch/
*/

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var moment = require('moment');

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
    For each search: adds a query record containing the search term
    and a timestamp
    */
    var searchString = req.params.search;
    var searchTerms = searchString.split(' ');
    var offset = req.query.offset ? Number(req.query.offset) : 0;
    var timeStamp = moment().format();

    // Create a record of the query
    Query.create({
        term: searchString,
        when: timeStamp
    }, function(err, timeStamp) {
        if (err) {
            console.log(err);
        }
    });

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
                        // Create and send JSON response
                        var response = {};
                        for (var i = 0; i < images.length; i++) {
                            var jsonString = JSON.stringify(images[i]);
                            response[i] = JSON.parse(jsonString);
                        }
                        res.send(response);
                    }
                });
});

app.get('/api/latest/imagesearch/', function(req, res) {
    /*
    Route used to display the last 10 queries
    */
    Query.find({}, { _id: 0, __v: 0 }, { sort: { when: -1 }, limit: 10 },
        function(err, queries) {
            if (err) {
                console.log(err);
            } else {
                // Create and send JSON response
                var response = {};
                for (var i = 0; i < queries.length; i++) {
                    var jsonString = JSON.stringify(queries[i]);
                    response[i] = JSON.parse(jsonString);
                }
                res.send(response);
            }
    });
});

// Helper function used to create image records
// keep commented out for normal usage
// Image.create({
//     "url": "https://i.ytimg.com/vi/czhDhxFfZsM/maxresdefault.jpg",
//     "snippet": "Baby & Kids Fails - 2015 FUNNY ...",
//     "thumbnail": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRCuq3OJnxBpSvf1qLBRRC6Spk8Jy2vRiki3I6B-GpKA9_h_VmdZPnCCTFU",
//     "context": "https://www.youtube.com/watch?v=czhDhxFfZsM"
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
