load('vertx.js');

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

/*
 * Execute cmdLine synchronously from workingDirectory.
 * Will kill cmdLine of runs for more than timeoutInMs milliseconds
 * Returns { exitValue: <cmdLine exit value>, output: <what was written to stdOut + stdErr by cmdLine> }
 * 
 * Requires: lib/commons-exec-1.1.jar (http://commons.apache.org/exec/)
 */
function runCommand(command, workingDirectory, timeoutInMs) {
	
	var executor = new org.apache.commons.exec.DefaultExecutor();
	var cmdLine = org.apache.commons.exec.CommandLine.parse(command);
	
	executor.setWorkingDirectory(new java.io.File(workingDirectory));
	
	var watchdog = new org.apache.commons.exec.ExecuteWatchdog(timeoutInMs);
	executor.setWatchdog(watchdog);
	
	var outputStream = new java.io.ByteArrayOutputStream();
	var streamHandler = new  org.apache.commons.exec.PumpStreamHandler(outputStream);
	executor.setStreamHandler(streamHandler);
    
	var exitValue = executor.execute(cmdLine);
	
	return { "exitValue": exitValue, "output": outputStream.toString() };
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
					};
				} else {
					gitRepo = findGitRepo(children[i], github_repo, branch_ref);
				};
			};
		};
		return gitRepo;
	};

	var repoPath = findGitRepo(config.gitReposParentFolder,
			message.github_repo, message.ref);
	logger.info(repoPath);
	
	var gitOutput = runCommand("git pull", repoPath, COMMAND_EXEC_TIMEOUT_MS);
	
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
