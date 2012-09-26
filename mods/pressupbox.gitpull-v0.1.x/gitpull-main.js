
load('vertx.js');

var eb = vertx.eventBus;
var logger = vertx.logger;

var address = 'pressupbox.gitpull';

var handler = function(message, replier) {
  logger.info('[pressupbox.gitpull-v0.1.x] Received message ' + JSON.stringify(message));

  //TODO: Implement this logic
/*
- find the git working copy which has this repo as its origin, and is on this branch
*
* $ cat .git/HEAD
ref: refs/heads/master

$ cat .git/FETCH_HEAD
3513c733b759019ad20a0d8a755c23dca8b408bb branch 'master' of github.com:forsitethemes/demo.forsitethemes.com


$git_wc = "/data/app_containers/app_container1/www1/demo.forsitethemes.com";
shell_exec('git pull --git-dir $git_wc/.git');

*/  

  var reply = {
  	status: "ok",
  	message: "issued git pull on wc for " + message.github_repo + "@" + message.ref
  };
  replier(reply);
}

eb.registerHandler(address, handler);
logger.info("[pressupbox.gitpull-v0.1.x] Listening for eventBus messages on: " + address);

function vertxStop() {
  eb.unregisterHandler(address, handler);
}


