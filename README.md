Image Search Abstraction Layer

Deployed to: `https://gp22-imagesearch.herokuapp.com/`

This simple app let's you get the image URLs, alt text and page urls in JSON format for a set of images relating to a query string.

Example:

`https://gp22-imagesearch.herokuapp.com/api/imagesearch/query string`

You can paginate through the responses by adding a ?offset=n parameter to the URL, where n is the starting record number when showing search results.

Example:

`https://gp22-imagesearch.herokuapp.com/api/imagesearch/query?offset=10` returns records starting at the 10th record

You can get a list of the most recently submitted search strings in JSON format by going to:

`https://gp22-imagesearch.herokuapp.com/api/latest/imagesearch/`