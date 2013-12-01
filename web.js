var express = require('express');
var jade = require('jade');

var app = express.createServer(express.logger());
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var fs = require('fs');
var buf = fs.readFileSync('index.html');
var finalString = buf.toString('utf-8',0,buf.length-1);

app.use(app.router);
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send(finalString);
});

// var fn= jade.compile(jadeTemplate);
app.get('/gist/:id', function(request, response) {
	response.render('gist', {id: request.params.id});
	// var gist = fs.readFileSync('gist.html?id='+id);
	// var finalGist = buf.toString('utf-8',0,gist.length-1);
 //  response.send(finalGist);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});