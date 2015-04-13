var twitterStream = angular.module('myApp', ['ui.bootstrap']);

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});


twitterStream.controller('MainCtrl', [
  '$scope', 'socket',
  function($scope, socket){
    $scope.status = "No tweets yet...";
    $scope.tweets = [];
    var i = 0;
    socket.on('newTweet', function (tweet) {
      console.log(tweet)
      $scope.status = "";
      $scope.tweets.push(tweet);
    });
  }
]);