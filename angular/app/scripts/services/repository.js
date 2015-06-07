'use strict';

/**
 * @ngdoc service
 * @name githubSearchApp.repository
 * @description
 * # repository
 * Service in the githubSearchApp.
 */
angular.module('githubSearchApp')
  .service('repository', function ($http) {

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