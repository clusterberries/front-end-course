'use strict';

/**
 * @ngdoc function
 * @name githubSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the githubSearchApp
 */
angular.module('githubSearchApp')
  .controller('MainCtrl', ['$scope', '$http', 'repository', function (scope, $http, repository){
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
	// isRepeat is a flag. Need it to avoid too mush requests
	scope.searchWithInterval = function(isRepeat) {
		// compate dates of this and previous searches
		if (new Date() - scope._searchInterval > 1000) {
			scope.search();
		}
		else if(!isRepeat) {
			// if to search withount delay and interval there will be an error 403
			setTimeout(function() {
				scope.searchWithInterval(true);
			}, 2500);
		}
		scope._searchInterval = new Date();
	}

}]);
