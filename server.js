// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const GoogleImages = require('google-images');
var mongodb = require('mongodb');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/img/:term/:offset", function(request, response) {
  const client = new GoogleImages('012103343266811273655:at3faocvpu0', 'AIzaSyDmSfdEjT12w_Zy0oTPOhswd7y7i6HSABU');
  
   connectToMongo(function(callbackResponse){
    if(!callbackResponse.error){
      saveURL(callbackResponse.collection, origURL, function(resultObj){
        response.send(resultObj);
      });
    }else{
      response.send(callbackResponse);
    }
  });
  
  client.search(request.params.term, {page: request.params.offset})
    .then(images => {
    // response.send(images);
      var result = []; 
        images.forEach(function(element){
          result.push({
            url: element.url, 
            snippet: element.description, 
            thumbnail: element.thumbnail.url,
            context: element.parentPage,
          })
        });
    
        response.send(result);
    });
});

function connectToMongo(callback){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/microservice4';  
  
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      callback({ error: "Unable to connect to the mongoDB server" });
    } else {
      console.log('Connection established to', url);
      
      db.collection("urls", function(error, collection){
        if(!error){
          callback({db: db, collection: collection});  
        }else{
          callback({ error: "Could not connect to DB!" });
        }
        
      });
    }
  });
}

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
