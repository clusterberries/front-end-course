// store information about all repos and current repo
angular.module('githubSearchApp') 
.service('repo', function () {
	var _repo, _repos;
  	return {
        setRepos: function (repo, repos) {
        	console.log('reposSet');
        	_repo = repo;
        	_repos = repos;
        },
        getRepo: function () {
        	return _repo;
        },
        getRepos: function () {
        	return _repos;
        },
	}
});