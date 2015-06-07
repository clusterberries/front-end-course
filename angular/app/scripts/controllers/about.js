'use strict';

/**
 * @ngdoc function
 * @name githubSearchApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the githubSearchApp
 */
angular.module('githubSearchApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
