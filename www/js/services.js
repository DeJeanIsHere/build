var api = 'thestairsintlesonlynowth';
var pass = 'd745804ec0cca1dd2e8e9ef2a4c123058de603c8';
var base_url = 'https://' + api + ':' + pass + '@janderoeck.cloudant.com/ksjstreepkesshit/';
var users_view = '_design/views/_view/budget';

angular.module('drinks.services', [])

.service('ImgService', [function() {
	return {
		getImg: function(user) {
			if (("img/" + user._id + ".png") !== null && ("img/" + user._id + ".png") !== undefined) {
				return ("img/" + user._id + ".png");
			}
			else {
				return "img/no-avatar.png";
			}
		}
	}
}])
.service('ImgDetailService', [function() {
	return {
		getImg: function(user) {
			if (("img/" + user + ".png") !== null && ("img/" + user + ".png") !== undefined) {
				return ("img/" + user + ".png");
			}
			else {
				return "img/no-avatar.png";
			}
		}
	}
}])

.service('UserService', ['$http', '$q', '$location', 'StorageService', function($http, $q, $location, StorageService) {
	user = {};
	return {
    /* Getters */
		getName: function() {
			return user.name;
		},
		getRevision: function() {
			return user.rev;
		},
		getTotal: function() {
			return user.total;
		},
		getPin: function() {
			return user.pin;
		},
		getBudget: function() {
			return user.budget;
		},
		getDetailBudget: function(userSelected) {
			return userSelected.budget;
		},
		getImg: function() {
			if(("img/" + user._id + ".png") !== null && ("img/" + user._id + ".png") !== undefined) {
				return ("img/" + user._id + ".png");
			}
			else {
				return base_url + user._id + "/" + Object.getOwnPropertyNames(user._attachments)[0];
			}
		},

		getUsers: function() {
			$http.defaults.headers.common.Authorization = 'Basic ' + btoa(api + ':' + pass);
			var q = $q.defer();
			$http.get(base_url + users_view).
			success(function(data, status) {
				q.resolve(data.rows);
			})
			return q.promise;
		},

		getDetailUser: function(user) {
			$http.defaults.headers.common.Authorization = 'Basic ' + btoa(api + ':' + pass);
			var q = $q.defer();
			$http.get(base_url + user).
			success(function(data, status) {
				q.resolve(data);
			})
			return q.promise;
		},

		checkPin: function(){

		},
		/* Setters */
    setBudget: function() {

    },
    /* Initialize */
		initUser: function(name, pin) {
			$http.defaults.headers.common.Authorization = 'Basic ' + btoa(api + ':' + pass);
			var url = base_url + name;
			var q = $q.defer();
			$http.get(url).
			success(function(data, status, headers, config) {
				StorageService.setObject(name, data);
				user = data;
				q.resolve(user);
				/*$location.path('tab/drinks');*/
			});
			return q.promise;
		},
    /* Post Data */
    updateUser: function() {
			var url = base_url + name;
			$http.post(url, user).
			success(function(data, status, headers, config) {
				user._rev = data.rev;
			});
    },
    /* Other functions */
		goToPageDrinks: function() {
			$location.path('tab/drinks');
		},
		goToPageAdmin: function() {
			$location.path('tab/admin');
		},
		goToPageSocial: function() {
			$location.path('tab/social');
		},
    drink: function() {
      user.budget -= 0.6;
			user.budget = parseFloat(parseFloat(user.budget).toFixed(1));
			user.total += 0.6;
			user.total = parseFloat(parseFloat(user.total).toFixed(1));
    },
		reload: function(amount, userSelected) {
			userSelected.budget += amount;
			userSelected.budget = parseFloat(parseFloat(userSelected.budget).toFixed(1));
			$http.post(base_url, userSelected).
			success(function(data, status, headers, config) {
				userSelected._rev = data.rev;
			});
		}
	}
}])

.service('StorageService', ['$window', function($window) {
	return{
		set: function(key, value){
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue){
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value){
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key){
			return JSON.parse($window.localStorage[key] || '{}');
		}
	}
}]);
