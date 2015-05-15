'use strict';

angular.module('nodeAirScraperApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];



    $scope.columnDefs= [{ field: 'name',displayName: 'Property Name',groupable: false}];
    $scope.myOptions = { data: 'myData' };

    $scope.searchCity = function() {
        $http.get('/scrape/Torino--TO/1').
        success(function(data) {
            $scope.geo = data.geo;
            $scope.myData=data.hosts;
            $scope.gmap= data.hosts.geo;
            $scope.myOptions = { data: 'myData' };
            $scope.mostraResult=true;
            console.log('latitude:' +$scope.geo.latitude +'longitude: '+$scope.geo.longitude);
            $scope.map = { center: { latitude: $scope.geo.latitude, longitude: $scope.geo.longitude },
                            geo: {
                            },
                            zoom: 12
                        };
         }).error(function() {
          console.log('merda');
         });
    };





  });
