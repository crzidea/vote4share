var rankingLength = 10;
var app = angular.module('app', ['ngResource'])
    , rankingLength = 10
    , Share , Votes;

app.controller('ShareCtrl', function ($scope, $resource) {

        Share = $resource('share/:id', {id: '@id'});
        $scope.share = Share.query(function () {
            $scope.ranking = _.sortBy($scope.share, function () {
                return 'votes'
            }).slice(0, rankingLength);
        });

        Votes = $resource('share/:id/votes', {id: '@id'});

});
