var myApp = angular.module("XmppApp", ['ngRoute','dbaq.emoji','ngSanitize']);
myApp.controller("page", function($scope) {
	$scope.message = "Welcome to angular hello world application";
	
});
myApp.config(function(emojiConfigProvider) {
	emojiConfigProvider.addAlias("smile", ":)");
	emojiConfigProvider.addAlias("heart", "<3");
	emojiConfigProvider.addAlias("ok_hand", "+1");
});
myApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'templates/login.html',
		//controller : 'LoginController'
	}).when('/register', {
		templateUrl : 'templates/register.html',
		//controller : 'RegisterController'
	}).when('/resetpassword', {
		templateUrl : 'templates/resetpassword.html',
		//controller : 'RegisterController'
	}).when('/homepage', {
		templateUrl : 'templates/home.html',
		controller : 'LoginController'
	}).when('/logout', {
		redirectTo : '/login'
		//controller : 'RegisterController'
	}).when('/homepage1', {
		templateUrl : 'templates/home1.html',
		controller : 'LoginController'
	})
	.otherwise({
		redirectTo : '/login'
	});
} ]);

/*myApp.controller('LoginController', function($scope) {
	
	$scope.message = 'This is Add new order screen';
	
});*/


myApp.controller('RegisterController', function($scope) {

	$scope.message = 'This is Show orders screen';

});