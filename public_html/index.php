<?php
require '../vendor/autoload.php';

$app = new \Slim\Slim();

$app->post('/github/new_commits_available', function () use ($app) {
	ignore_user_abort(true);
	set_time_limit(600);

	$req = $app->request();
	$payload_json = json_decode($req->post('payload'));

	$github_repo = str_replace("http://github.com/","",$payload_json->repository->url);
	$github_ref = $payload_json->ref;
	
	/* TODO - find the git working copy which has this repo as its origin, and is on this branch
	 * 
	 * $ cat .git/HEAD 
ref: refs/heads/master

$ cat .git/FETCH_HEAD 
3513c733b759019ad20a0d8a755c23dca8b408bb		branch 'master' of github.com:forsitethemes/demo.forsitethemes.com


	 */
	
	$git_wc = "/data/app_containers/app_container1/www1/demo.forsitethemes.com";
	shell_exec('git pull --git-dir $git_wc/.git');

});

$app->run();