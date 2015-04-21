var iTunesBaseUrl = "https://itunes.apple.com/search?term=coldplay";


var app = angular.module("iTunesApp", []);

//  ***************************************************************
//  CUSTOM DIRECTIVES
//  ***************************************************************
app.directive('iTunesLink', function () {
  return {
  	restrict: 'EA',
  	require: '^ngModel',
  	replace: true,
  	scope: {
  		ngModel: '=',
  		musicPlayer: '='
  	}
  }
});



//  ***************************************************************
//  SERVICES
//  ***************************************************************

app.factory('audio', function ($document) {
	var audio = $document[0].createElement('audio');
	return audio;
});

app.factory('iTunesService', function ($http) {
	return {
		get: function (searchTerm) {
			return $http.jsonp(iTunesBaseUrl, {
				params: {
					callback: 'JSON_CALLBACK',
					term: searchTerm
				}
			});
		}
	}
});

app.factory('musicPlayerService', function ($rootScope, audio) {
	var musicPlayer = {
		isPlaying: false,

		play: function(result) {
			console.log('in PLAY function');
			if (musicPlayer.isPlaying) {
				musicPlayer.stop();
			}

			var url = result.previewUrl;
			audio.src = url;
			audio.play();
			musicPlayer.isPlaying = true;
		},

		stop: function () {
			console.log('in STOP', musicPlayer.isPlaying);
			if (musicPlayer.isPlaying) {
				console.log('pausing audio');
				audio.pause();
				musicPlayer.isPlaying = false;
			}
		}
	};

	audio.addEventListener('ended', function () {
		$rootScope.$apply(musicPlayer.stop());
	});

	return musicPlayer;
});

//  ***************************************************************
//  CONTROLLERS
//  ***************************************************************
app.controller('SearchResultsController', function ($scope, audio, iTunesService, musicPlayerService) {
	$scope.searchTerm = "Tame Impala";

	$scope.musicPlayer = musicPlayerService;

	// get the data from iTunes API via a service
	$scope.doSearch = function() {
		iTunesService.get($scope.searchTerm)
		  .success(function (data, status) {
				$scope.results = data.results;
		  });
	}

	$scope.playSample = function (result) {
		console.log('playing audio sample');
		var audioSrc = result.previewUrl;

		// utilize the Player service
	}


});
