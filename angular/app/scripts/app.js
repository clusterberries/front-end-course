'use strict';

/**
 * @ngdoc overview
 * @name githubSearchApp
 * @description
 * # githubSearchApp
 *
 * Main module of the application.
 */
angular
  .module('githubSearchApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
/*       .when('/about', {
       templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })*/
      .when('/details/:item', {
        templateUrl: 'views/details.html',   
        controller: 'DetailsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
