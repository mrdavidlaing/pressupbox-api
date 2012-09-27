load('test_utils.js');
load('vertx.js');

var tu = new TestUtils();
var logger = vertx.logger;
var eb = vertx.eventBus;

function setupAll() {
	logger.info("[api-tests] setupAll");
    tu.azzert('ok' === 'ok');
}

function testOne() {
	logger.info("[api-tests] testOne");
    tu.azzert('ok' === 'ok');
}

tu.registerTests(this);
var persistorConfig = {address: 'test.persistor', db_name: 'test_db'};
vertx.deployModule('pressupbox.gitpull-v0.1.x', persistorConfig, 1, function() {
	 logger.info("[api-tests] pressupbox.gitpull-v0.1.x has been deployed!");
	 setupAll();
	 tu.appReady();
});

function vertxStop() {
  tu.unregisterAll();
  tu.appStopped();
  logger.info("[api-tests] vertxStop!");
}

logger.info("[api-tests] Done!");