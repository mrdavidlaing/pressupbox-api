load('test_utils.js');
load('vertx.js');

var tu = new TestUtils();
var logger = vertx.logger;
var eb = vertx.eventBus;

function setupAll() {
	logger.info("[gitpull-tests] setupAll");
}

function testExecuteGitPullOnCorrectRepo() {
	logger.info("[gitpull-tests] testExecuteGitPullOnCorrectRepo");
	var msg = {
		github_repo : "mrdavidlaing/mockGitRepo1",
		ref : "refs/heads/master"
	};
	
	eb.send('pressupbox.gitpull', msg, function(reply) {
		tu.azzert(reply.status === 'ok');
		tu.azzert(reply.message === 'Executed mockGitRepo1-master/git pull');
		tu.testComplete();
	});
}

tu.registerTests(this);

var config = { gitReposParentFolder: "/Users/mrdavidlaing/Projects/mrdavidlaing/pressupbox-api/" };
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