var module = angular.module('mod', []);

module.controller('controller', ['$scope', '$http', 'repository', function (scope, $http, repository){
	scope.searchTypes = ['asc', 'des'];
	scope.sortType = scope.searchTypes[0];
	scope.limit = 10;
	scope.filterText = '';
	scope.maxSize = '500';
	scope.minForks = 0;
	scope.minStars = 0;
	repository.async(scope.filterText, scope.minForks, scope.maxSize, scope.minStars, scope.limit
		).then(function(resp) {
		scope.repos = resp;
		console.log(resp);
	});

}]);

module.service('repository', function($http) {

	var baseUrl = "https://api.github.com";
	var repository = {
	    async: function(filterText, minForks, maxSize, minStars, limit) {
		    var promise = $http.get(baseUrl + '/search/repositories?q=' + filterText + '+forks:>=' + minForks + '+size:<' + maxSize + '+stars:>=' + minStars
		    ).then(function (response) {
		    	return response.data.items.slice(0, limit);;
		    });
		    return promise;
	    }
	};
	return repository;
});
