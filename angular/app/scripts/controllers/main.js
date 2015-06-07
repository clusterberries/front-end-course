'use strict';

/**
 * @ngdoc function
 * @name githubSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the githubSearchApp
 */
angular.module('githubSearchApp')
  .controller('MainCtrl', ['$scope', '$http', 'repository', 'repo', function (scope, $http, repository, repo){
	scope.searchTypes = ['asc', 'des'];
	scope.sortType = scope.searchTypes[0];
	scope.limit = 10;
	scope.filterText = '';
	scope.maxSize = '500';
	scope.minForks = 0;
	scope.minStars = 0;
	scope._searchInterval = new Date();
	scope.search = function() {
		repository.async(scope.filterText, scope.minForks, scope.maxSize, scope.minStars, scope.limit
			).then(function(resp) {
			scope.repos = resp;
		});
	}
	// isRepeat is a flag. Need it to avoid too many requests
	scope.searchWithInterval = function(isRepeat) {
		// compare dates of this and previous searches
		if (new Date() - scope._searchInterval > 1000) {
			scope.search();
		}
		else if(!isRepeat) {
			// if search withount delay and interval there will be an error 403
			setTimeout(function() {
				scope.searchWithInterval(true);
			}, 2500);
		}
		scope._searchInterval = new Date();
	}

	// when cklick on 'details' link write data about all repos and current repo
	scope.setRepos = repo.setRepos;

	// if there is stored data in service load it to view
	// in other words it works when click on link 'back'
	if (repo.getRepos()) {
		console.log('ee');
		scope.repos = repo.getRepos();
	}

}]);
