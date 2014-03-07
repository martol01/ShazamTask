var shazamApp=angular.module('shazamApp');
shazamApp.controller('SongController', function($scope, $http){
$scope.songs=[];
	$scope.songData={};
	$scope.url='/api/v1/songs/';
	$scope.getSongs=function(){
		$http.get($scope.url)
		.success(function(data){
		songs=data;
		console.log(JSON.stringify(data));
		console.log(songs.length);
		})
		.error(function(data){
			console.log('Error '+ JSON.stringify(data));
		});
	}
	//GET SONG INDIVIDUAL BY nAme
	$scope.createSong=function(){
		$http.post($scope.url, $scope.songData)
	.success(function(data){
		$scope.songData={};
//		TRY IF RETURNS  the data
		console.log("CREATED SUCCESSFULLY");
		console.log(JSON.stringify(data));
	})
	.error(function(data){
		console.log('Error '+ JSON.stringify(data));
	});
	}


});
shazamApp.controller('AdminController',function($scope, $http){

$scope.url='/api/v1/songs/';
$scope.songs=null;
$scope.songData={};
$http.get($scope.url)
.success(function(data){
	$scope.songs=data;
	console.log(JSON.stringify(data));
})
.error(function(data){
	console.log("Error "+JSON.stringify(data));
});
$scope.updateSong=function(id){
		$http.put($scope.url+id, $scope.songData)
		.success(function(data){
			$scope.songData={};
			console.log("UPDATED SUCCESSFULLY");
			console.log(JSON.stringify(data));
			//TRY IF RETURNS 1 or the data
		})
		.error(function(data){
			console.log("Error "+ JSON.stringify(data));
		});
	}

	$scope.deleteSong=function(id){
		$http.delete($scope.url+id)
		.success(function(data){
			$scope.songs=data;
			console.log(JSON.stringify(data));
		})
		.error(function(data){
			console.log("Error "+data);
		});
	};
	$scope.getSongsByArtist=function(artist){
		$http.get($scope.url+artist)
		.success(function(data){
			console.log(JSON.stringify(data));
		})
		.error(function(data){
			console.log("Error "+ JSON.stringify(data));
		});
	};

});
