var module = angular.module('mod', []);

module.controller('controller', ['$scope', '$http', 'filterFilter', function (scope, $http, filterFilter){
	scope.searchTypes = ['asc', 'des'];
	scope.sortType = scope.searchTypes[0];
	scope.limit = 10;
	scope.filterText = '';
	scope.search = function() {
		$http.get('repositories.json').then(function(response) {
			var resp = response.data;
			resp = scope.sortType === 'asc' ? resp.sort(function(a, b) {
				if (a.full_name.toLowerCase() > b.full_name.toLowerCase()) return 1;
				else if (a.full_name.toLowerCase() === b.full_name.toLowerCase()) return 0;
				else return -1;
			})
			: resp.sort(function(a, b) {
				if (a.full_name.toLowerCase() < b.full_name.toLowerCase()) return 1;
				else if (a.full_name.toLowerCase() === b.full_name.toLowerCase()) return 0;
				else return -1;
			});
			resp = filterFilter(resp, scope.filterText);
			scope.repos = resp.slice(0, scope.limit);
		});
	}

}]);
