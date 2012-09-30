#!/bin/bash
rm -rf $1
mkdir -p $1/{gitRepo1-master,gitRepo1-branch1}

git clone git://github.com/github/testrepo.git $1/gitRepo1-master
git --git-dir $1/gitRepo1-master/.git checkout HEAD~2 

git clone git://github.com/github/testrepo.git $1/gitRepo1-branch1
git --git-dir $1/gitRepo1-branch1/.git checkout HEAD~2 
git --git-dir $1/gitRepo1-branch1/.git checkout -b branch1
	