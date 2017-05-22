var app = angular.module('demoApp', ['multipleDatePicker']);

app.controller('demoController', ['$scope', function ($scope) {
    $scope.today = new Date();

    $scope.dates = [];
}]);
