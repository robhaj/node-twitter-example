var twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["iPhone", "iPad", "Android", "Web Client", "Other"];
  //chart colors
  $scope.colors = ['#6c6a6c','#000000','#7FFD1F','#EC872A', '#9527C2'];
  //intial data values
  $scope.trumpData = [0,0,0,0,0];
  $scope.sandersData = [0,0,0,0,0];

  socket.on('newTweet', function (tweet) {
    $scope.tweet = tweet.text
    $scope.user = tweet.user.screen_name
    //parse source from payload
    var source = tweet.source.split('>')[1].split('<')[0].split(' ')[2]
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase()
    })

    //check source and increment for #trump tweets
    if (hashtags.indexOf('trump') !== -1){
      switch (source) {
        case 'iPhone': $scope.trumpData[0]++
        break;
        case 'iPad': $scope.trumpData[1]++
        break;
        case 'Android': $scope.trumpData[2]++
        break;
        case 'Web': $scope.trumpData[3]++
        break;
        default: $scope.trumpData[4]++
      }
    }

    //check source and increment for #feelthebern tweets
    else if (hashtags.indexOf('feelthebern') !== -1) {
      switch (source) {
        case 'iPhone': $scope.sandersData[0]++
        break;
        case 'iPad': $scope.sandersData[1]++
        break;
        case 'Android': $scope.sandersData[2]++
        break;
        case 'Web': $scope.sandersData[3]++
        break;
        default: $scope.sandersData[4]++
      }
    }
  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

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
