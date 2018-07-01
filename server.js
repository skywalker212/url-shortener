// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var shortid = require('shortid');
var validUrl = require('valid-url');

function Map() {
    this.keys = new Array();
    this.data = new Object();

    this.put = function (key, value) {
        if (this.data[key] == null) {
            this.keys.push(key);
        }
        this.data[key] = value;
    };

    this.get = function (key) {
        return this.data[key];
    };

    this.remove = function (key) {
        this.keys.remove(key);
        this.data[key] = null;
    };

    this.isEmpty = function () {
        return this.keys.length == 0;
    };

    this.size = function () {
        return this.keys.length;
    };
}

var shortenedURLs = new Map();
var originalURLs = new Map();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/shorturl',function(request,response){
  var url = request.body.url;
  if(validUrl.isUri(url)){
      var shortened = shortenedURLs.get(url);
      if(!shortened){
        shortened = shortid.generate();
        shortenedURLs.put(url,shortened);
        originalURLs.put(shortened,url);
      }
      response.json({"original-url":url,"short_url":shortened});
  }else response.json({"error":"invalid URL"});
});

app.get('/shorturl/:uri',function(request,response){
  var uri = request.params.uri;
  var ori = originalURLs.get(uri);
  if(ori){
    response.redirect(ori);
  }else response.json({"error":"shortened url does not exist"})
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
