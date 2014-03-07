var shazamApp=angular.module('shazamApp',['ngRoute']);
shazamApp.config(function($routeProvider){
	$routeProvider
	.when('/', {templateUrl:'/../partials/home.html', controller: 'SongController'})
	.when('/admin',{templateUrl:'/../partials/admin.html', controller: 'AdminController'})
});
