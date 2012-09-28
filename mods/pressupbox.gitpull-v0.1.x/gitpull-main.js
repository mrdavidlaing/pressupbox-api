load('vertx.js');

var eb = vertx.eventBus;
var logger = vertx.logger;
var config = vertx.config;
var address = 'pressupbox.gitpull';

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function fileContains(path, needle) {
	var fileContentsBuff = vertx.fileSystem.readFileSync(path);
	var fileContents = fileContentsBuff.getString(0, fileContentsBuff.length());
	if (fileContents.indexOf(needle) != -1) {
		return true;
	}
	return false;
}

var handler = function(message, replier) {
	logger.info('[pressupbox.gitpull-v0.1.x] Received message '
			+ JSON.stringify(message));

	var gitRepo = "cannot/find/git/repo";
	var findGitRepo = function(parentFolder, github_repo, branch_ref) {
		var children = vertx.fileSystem.readDirSync(parentFolder, '.*');
		for ( var i in children) {
			if (vertx.fileSystem.propsSync(children[i]).isDirectory) {
				if (endsWith(children[i], ".git")) {
					if (fileContains(children[i] + "/config", github_repo)
							&& fileContains(children[i] + "/HEAD", branch_ref)) {
						return children[i].replace("/.git", "");
					}
				} else {
					gitRepo = findGitRepo(children[i], github_repo, branch_ref);
				}
			}
		}
		;
		return gitRepo;
	};

	var repoPath = findGitRepo(config.gitReposParentFolder,
			message.github_repo, message.ref);
	logger.info(repoPath);

	var options = {
		args : [ "pull" ],
		// capture stdout to the options.output property
		output : ''
	};
	
	runCommand(repoPath + "/git", options);

	var reply = {
		status : "ok",
		message : options.output
	};
	replier(reply);
};

eb.registerHandler(address, handler);
logger.info("[pressupbox.gitpull-v0.1.x] Listening for eventBus messages on: "
		+ address);

function vertxStop() {
	eb.unregisterHandler(address, handler);
}
