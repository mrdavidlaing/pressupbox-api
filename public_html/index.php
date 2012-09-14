<?php
require '../vendor/autoload.php';

$app = new \Slim\Slim();
		
$app->post('/github/new_commits_available', function () use ($app, $obj) {
    
		$req = $app->request();
		$payload_json = $req->post('payload');
		
	  $payload = json_decode($payload_json);
		
		print_r($payload);
		
});

$app->run();