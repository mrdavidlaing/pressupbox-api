load('test_utils.js');
load('vertx.js');
load('runCommand.js');

var tu = new TestUtils();
var logger = vertx.logger;
var eb = vertx.eventBus;
var COMMAND_EXEC_TIMEOUT_MS = 1 * 60 * 1000;
var testDataFolder = getModulePwd() + "tmp/testData";

function getModulePwd() {
	var children = vertx.fileSystem.readDirSync(".", '.*');
	var parts = children[0].split('/');
	return children[0].replace(parts[parts.length-1], '');
}

function setupAll() {
	logger.info("[gitpull-tests] setupAll");
	
	var result = runCommand('./setupTestData.sh "'+testDataFolder+'"', getModulePwd(), COMMAND_EXEC_TIMEOUT_MS);
	if (result.exitValue!==0) {
		logger.error(result.output);
	}
}

function testExecuteGitPullOnCorrectRepo() {
	logger.info("[gitpull-tests] testExecuteGitPullOnCorrectRepo");
	var msg = {
		github_repo : "github/testrepo",
		ref : "refs/heads/master"
	};
	
	eb.send('pressupbox.gitpull', msg, function(reply) {

		logger.info("reply to msg: " + JSON.stringify(msg) + " to topic: pressupbox.gitpull is: " + JSON.stringify(reply));
		
		tu.azzert(reply.status === 'ok');
		tu.azzert(reply.message === 'Already up-to-date.\n');
		tu.testComplete();
	});
}

tu.registerTests(this);

var config = { gitReposParentFolder: testDataFolder };
vertx.deployModule('pressupbox.gitpull-v0.1.x', config, 1, function() {
	setupAll();
	tu.appReady();
	var jutils = new org.vertx.java.framework.TestUtils(org.vertx.java.deploy.impl.VertxLocator.vertx);
	jutils.startTest("testExecuteGitPullOnCorrectRepo");
});

function vertxStop() {
	tu.unregisterAll();
	tu.appStopped();
	logger.info("[gitpull-tests] vertxStop!");
}