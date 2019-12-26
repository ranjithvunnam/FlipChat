myApp.controller("regController", function($scope, $http , $location) {
	$scope.countries = [ {
		name : "Afghanistan"
	}, {
		name : "Antarctica"
	}, {
		name : "Argentina"
	}, {
		name : "Australia"
	}, {
		name : "Bangladesh"
	}, {
		name : "Bhutan"
	}, {
		name : "Brazil"
	}, {
		name : "Canada"
	}, {
		name : "Chile"
	}, {
		name : "China"
	}, {
		name : "France"
	}, {
		name : "Germany"
	}, {
		name : "Greece"
	}, {
		name : "Hong Kong"
	}, {
		name : "India"
	}, {
		name : "Indonesia"
	}, {
		name : "Iran"
	}, {
		name : "Iraq"
	}, {
		name : "Ireland"
	}, {
		name : "Italy"
	}, {
		name : "Japan"
	}, {
		name : "Korea"
	}, {
		name : "Kuwait"
	}, {
		name : "Nepal"
	}, {
		name : "New Zealand"
	}, {
		name : "Russian Federation"
	}, {
		name : "Singapore"
	}, {
		name : "Sri Lanka"
	}, {
		name : "Sweden"
	}, {
		name : "Switzerland"
	}, {
		name : "United Kingdom"
	}, {
		name : "United States"
	}, {
		name : "Zimbabwe"
	} ];
	var user = {
		mobile : '',
		password : '',
		country : angular.copy($scope.countries[14])
	};
	$scope.user = user;
	var BOSH_HOST = "http://127.0.0.1:7070/http-bind/";
	var conn = new Strophe.Connection(BOSH_HOST);
	
	// openfire registration
	$scope.registration = function(user) {
		var callback = function(status) {
			console.log(status);
			if (status === Strophe.Status.REGISTER) {
				// fill out the fields
				console.log("Registering...");
				conn.register.fields.username = user.mobile;
				conn.register.fields.password = user.password;
				// calling submit will continue the registration process
				conn.register.submit();
			} else if (status === Strophe.Status.REGISTERED) {
				console.log("registered!");
				// calling login will authenticate the registered JID.
				conn.authenticate();
			} else if (status === Strophe.Status.CONFLICT) {
				console.log("Contact already existed!");
			} else if (status === Strophe.Status.NOTACCEPTABLE) {
				console.log("Registration form not properly filled out.");
			} else if (status === Strophe.Status.REGIFAIL) {
				console.log("The Server does not support In-Band Registration");
			} else if (status === Strophe.Status.CONNECTED) {
				// do something after successful authentication
			} else {
				// Do other stuff
			}
		};

		conn.register.connect("127.0.0.1", callback, 60, 1);
		  
	};
});