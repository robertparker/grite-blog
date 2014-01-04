var express = require('express');
var jade = require('jade');
var everyauth = require('everyauth');

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

//everyauth
var usersById = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

var usersByGhId = {};

everyauth.debug = true;
everyauth.github
	.appId('APP_ID')
	.appSecret('APP_SECRET')
	.callbackPath('/github')
	.scope('gist')
	.findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser){
		return usersByGhId[ghUser.id] || (usersByGhId[ghUser.id] = addUser('github', ghUser));
		// var promise = this.Promise();
		// promise.fulfill(ghUser)
		// return 1664578;
	})
	.redirectPath('/');

	app.configure(function(){
		app.use(express.cookieParser());
		app.use(express.session({secret: 'APP_SECRET'}));
		app.use(everyauth.middleware());

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

