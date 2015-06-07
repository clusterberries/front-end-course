angular.module('githubSearchApp')
  .controller('DetailsCtrl', function($scope, $http, repo) {
  	// get data about current repo
  	$scope.repo = repo.getRepo();
  	// load information about contributors
  	$http.get($scope.repo.contributors_url
  		).then(function (response) {
	    	$scope.contributors = response.data;
	    });
});
