var app = angular.module('app', ['ngResource']),
    rankingLength = 10;

app.controller('ShareCtrl', function($scope, $resource) {

    var Share = $resource('share/:id', {
        id: '@id'
    }),
        Votes = $resource('share/:id/votes', {
            id: '@id'
        });

    function rank() {
        var share = [];
        angular.forEach($scope.share, function(s) {
            share.push(s);
        })
        $scope.ranking = share.sort(function(a, b) {
            return b.votes - a.votes;
        }).slice(0, rankingLength);
    }

    $scope.share = Share.query(rank);

    $scope.vote = function(share) {

        var votes,
            conf = '确认给《' + share.name + ' 讲师：' +
                share.speaker + '》投票吗？';

        if (confirm(conf)) {
            Votes.save({
                id: share.id
            }, function(data) {
                share.votes = data.votes;
                rank();
            });
        };

    };

    $scope.add = function() {
        var s = {
            name: $scope.name,
            speaker: $scope.speaker,
            link: $scope.link,
            img: $scope.img + '?imageView/2/w/150/h/150/q/100'
        };
        Share.save(s, function(share) {
            $scope.share.push(s);
            $scope.name = "";
            $scope.speaker = "";
            $scope.link = "";
            $scope.img = "";
        })
    };
    $scope.del = function() {
        var oldShare = $scope.share;
        $scope.share = [];
        angular.forEach(oldShare, function(s) {
            if (!s.del) $scope.share.push(s);
            else Share.remove({
                id: s.id
            });
        });
    };

});