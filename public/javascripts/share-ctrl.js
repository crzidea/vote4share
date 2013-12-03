var app = angular.module('app', ['ngResource']),
    rankingLength = 10,
    Share;

app.controller('ShareCtrl', function($scope, $resource) {


    Share = $resource('share/:id', {
        id: '@id'
    });
    var Votes = $resource('share/:id/votes', {
        id: '@id'
    });

    function rank() {
        var share = [];
        angular.forEach($scope.share, function(s) {
            share.push(s);
        })
        share = share.sort(function(a, b) {
            return b.votes - a.votes;
        }).slice(0, rankingLength);
        angular.forEach(share, function(s, i) {
            s.ranking = ++i;
        });
        $scope.rankList = share;
    }

    $scope.share = Share.query(rank);

    $scope.vote = function(share) {

        var votes,
            conf = '支持讲师 ' +
                share.speaker + ' ？';

        if (confirm(conf)) {
            Votes.save({
                id: share.id
            }, function(data) {
                switch (data.votes) {
                    case -1:
                        alert('您今天已经投过票了，谢谢参与！');
                        break;
                    case -2:
                        alert('投票已经结束，谢谢参与！');
                        break;
                    default:
                        share.votes = data.votes;
                        rank();
                        break;
                }
            });
        };

    };

    $scope.add = function() {
        var s = {
            speaker: $scope.speaker,
            img: $scope.img || 'http://vote4share.u.qiniudn.com/cube.png',
            subjects: $scope.subjects
        };
        Share.save(s, function(share) {
            $scope.share.push(s);
            $scope.speaker = "";
            $scope.img = "";
            $scope.subjects = [{}]
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

    $scope.subjects = [{}];
    $scope.addSub = function() {
        $scope.subjects.push({});
    };


});