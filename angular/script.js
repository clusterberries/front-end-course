var module = angular.module("mod", []);

module.controller("controller", ['$scope', "$http", function (scope, $http){
	scope.search = function() {
		$http.get('repositories.json').then(function(response) {
			var resp = response.data.sort(function(a, b) {
				if (a.full_name.toLowerCase() > b.full_name.toLowerCase()) return 1;
				else if (a.full_name.toLowerCase() === b.full_name.toLowerCase()) return 0;
				else return -1;
			});
			scope.repos = resp.slice(0, 10);
		});
	}

}]);
