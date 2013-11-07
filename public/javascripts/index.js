var app = angular.module('app', ['ngResource']);
app.controller('ShareCtrl', //['scope', '$resource'],
    function ($scope, $resource) {

        var Share = $resource('share/:id');
        $scope.share = Share.query();

        var Raning = $resource('share/ranking');
        $scope.ranking = Raning.query()

    });
