load('vertx.js');
load('runCommand.js');

var eb = vertx.eventBus;
var logger = vertx.logger;
var config = vertx.config;
var address = 'pressupbox.gitpull';
var COMMAND_EXEC_TIMEOUT_MS = 5 * 60 * 1000;

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
						return children[i];
					};
				} else {
					gitRepo = findGitRepo(children[i], github_repo, branch_ref);
				};
			};
		};
		return gitRepo;
	};

	var repoPath = findGitRepo(config.gitReposParentFolder,	message.github_repo, message.ref);
	var workingPath = repoPath.replace('/.git','');
	
	var gitOutput = runCommand("git --git-dir \""+repoPath+"\" --work-tree \""+workingPath+"\" pull", './', COMMAND_EXEC_TIMEOUT_MS);
	
	var status = gitOutput.exitValue == 0 ? "ok" : "error";
	replier({
		"status"  : status,
		"message" : gitOutput.output
	});
};

eb.registerHandler(address, handler);
logger.info("[pressupbox.gitpull-v0.1.x] Listening for eventBus messages on: "
		+ address);

function vertxStop() {
	eb.unregisterHandler(address, handler);
}
