/*
Requirements:

COLLECTIONS:

image collection
schema:
    url: String,
    snippet: String,
    thumbnail: String,
    context: String

queries collection that saves every query string with a timestamp
schema:
    term: String,
    when: String

ROUTES:

imagesearch route: api/imagesearch/
with a query string that searches the db for the given parameters
it returns 10 records in JSON
may also include ?offset= which returns records starting at the given index number
(ex. ?offset=10 returns records starting at the 10th record)

latest search route: api/latest/imagesearch/
*/