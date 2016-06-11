angular.module('drinks.controllers', [])

.controller('LoginCtrl', function($scope, $ionicPopup, $timeout, UserService) {
  $scope.login = function() {
    UserService.initUser($('#user').val(), Sha256.hash($('#pass').val())).then(function(value) {
      $scope.pin = value.pin;

      if($scope.pin !== Sha256.hash($('#pass').val())) {
        $ionicPopup.alert({
           title: 'Wrong Password'
         });
      }
      else {
        UserService.goToPageDrinks();
      }
    });
  }
})

.controller('DrinksCtrl', function($scope, $ionicListDelegate, UserService) {
  $scope.updateBudget = function() {
    UserService.initUser($('#user').val(), Sha256.hash($('#pass').val()));
    UserService.goToPageDrinks();
    }
  $scope.drink = function() {
    UserService.drink();
    $scope.budget = UserService.getBudget();
    $ionicListDelegate.closeOptionButtons();
  }
  $scope.upload = function() {
    UserService.updateUser();
  }
	$scope.budget = UserService.getBudget();
})

.controller('SocialCtrl', function($scope, UserService, ImgService) {
  $scope.socialLoad = function() {
    UserService.getUsers().then(function(users){
      $scope.users = users;
      users.sort(function (a, b) {
        return b.value.total - a.value.total;
      });
    });
    UserService.goToPageSocial();
  }
})

.controller('AdminCtrl', function($scope,  $ionicPopup, UserService, ImgService) {
  $scope.showPopup = function() {
  $scope.data = {};
  var myPopup = $ionicPopup.show({
    template: '<input type="password" ng-model="data.pass">',
    title: 'Enter Password',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Enter</b>',
        type: 'button-positive',
        onTap: function(e) {
          if ($scope.data.pass == " ") {
            UserService.goToPageAdmin();
          }
          else {
            $ionicPopup.alert({
               title: 'Wrong Password'
             });
          }
        }
      }
    ]
  });
 };

  UserService.getUsers().then(function(users){
    $scope.users = users;
    $.each($scope.users, function(index, user) {
      user.value.img = ImgService.getImg(user.value);
    });
  });
})

.controller('AdminDetailCtrl', function($scope, $stateParams, UserService, ImgDetailService) {
  $scope.userSelected = $stateParams.userId;
  UserService.getDetailUser($scope.userSelected).then(function(value) {
    $scope.budgetSelected = value.budget;
    $scope.userSelected = value.name;
  });
  $scope.img = ImgDetailService.getImg($scope.userSelected);
  $scope.amount = null;
  $scope.reload = function(amount) {
    UserService.getDetailUser($scope.userSelected).then(function(value) {
      $scope.selected = value;
      UserService.reload(amount, $scope.selected);
      $scope.budgetSelected = UserService.getDetailBudget($scope.selected);
    });
  };
});
