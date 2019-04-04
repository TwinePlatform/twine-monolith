describe('Dashboard controller', function () {
  var $controller;
  var controller;
  var $scope;

  beforeEach(function () {
    angular.mock.module('app');

    angular.mock.inject(function (_$controller_) {
      $controller = _$controller_
    })

    $scope = { $on: function () {} };
    controller = $controller('DashboardController', { $scope: $scope });
  });

  test('check scope', function () {
    expect($scope.foo).toBeFalsy();
  });
})
