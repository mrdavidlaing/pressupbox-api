/*
This verticle contains the configuration for our application and co-ordinates
start-up of the verticles that make up the application.
*/
load('vertx.js');
var logger = vertx.logger;

// Deploy the modules that we need
vertx.deployModule('pressupbox.gitpull-v0.1.x', null, 1, function() {
    logger.info("[app.js] pressupbox.gitpull-v0.1.x has been deployed!");
});
vertx.deployModule('pressupbox.api-v0.1.x', null, 1, function() {
    logger.info("[app.js] pressupbox.api-v0.1.x has been deployed!");
});