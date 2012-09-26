
load('vertx.js');

var rm = new vertx.RouteMatcher();
var eb = vertx.eventBus;
var logger = vertx.logger;

rm.post('/github/new_commits_available', function(req) {
  //TODO:  Extract the real payload from the form vars
  var payload = 
	{
	  "before": "5aef35982fb2d34e9d9d4502f6ede1072793222d",
	  "repository": {
	    "url": "http://github.com/defunkt/github",
	    "name": "github",
	    "description": "You're lookin' at it.",
	    "watchers": 5,
	    "forks": 2,
	    "private": 1,
	    "owner": {
	      "email": "chris@ozmm.org",
	      "name": "defunkt"
	    }
	  },
	  "commits": [
	    {
	      "id": "41a212ee83ca127e3c8cf465891ab7216a705f59",
	      "url": "http://github.com/defunkt/github/commit/41a212ee83ca127e3c8cf465891ab7216a705f59",
	      "author": {
	        "email": "chris@ozmm.org",
	        "name": "Chris Wanstrath"
	      },
	      "message": "okay i give in",
	      "timestamp": "2008-02-15T14:57:17-08:00",
	      "added": ["filepath.rb"]
	    },
	    {
	      "id": "de8251ff97ee194a289832576287d6f8ad74e3d0",
	      "url": "http://github.com/defunkt/github/commit/de8251ff97ee194a289832576287d6f8ad74e3d0",
	      "author": {
	        "email": "chris@ozmm.org",
	        "name": "Chris Wanstrath"
	      },
	      "message": "update pricing a tad",
	      "timestamp": "2008-02-15T14:36:34-08:00"
	    }
	  ],
	  "after": "de8251ff97ee194a289832576287d6f8ad74e3d0",
	  "ref": "refs/heads/master"
	}



  var msg = { 
  	github_repo: payload.repository.url.replace("http://github.com/",""),
  	ref: payload.ref
  };

  eb.send('pressupbox.gitpull', msg, function(reply) {
	    logger.info('[pressupbox.api-v0.1.x] received a reply ' + JSON.stringify(reply));
	    req.response.end(JSON.stringify(reply));
  });

  logger.info("[pressupbox.api-v0.1.x] sent message " + JSON.stringify(msg));
  
});

// Catch all - serve the index page
rm.getWithRegEx('.*', function(req) {
  req.response.sendFile("index.html");
});

vertx.createHttpServer().requestHandler(rm).listen(8080);
logger.info("[pressupbox.api-v0.1.x] Listening for HTTP requests on port 8080");
