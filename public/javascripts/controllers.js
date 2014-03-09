var shazamApp=angular.module('shazamApp');
shazamApp.controller('SongController', function($scope, $http){

$scope.tags={};
$scope.songDetails={};
$scope.songData={};
$scope.tagData={};
$scope.url='/api/v1/songs/';
	$scope.getSongs=function(){
		$http.get($scope.url)
		.success(function(data){
		$scope.tags=data;
		console.log(JSON.stringify(data));
		})
		.error(function(data){
			console.log('Error '+ JSON.stringify(data));
		});
	};
	$scope.createSong=function(){
		$http.post($scope.url, $scope.songData)
	.success(function(data){
		$scope.songData={};
		console.log("CREATED SUCCESSFULLY");
		console.log(JSON.stringify(data));
	})
	.error(function(data){
		console.log('Error '+ JSON.stringify(data));
	});
	}
	$scope.createTag=function(){
		$http.post('/api/v1/tags', $scope.tagData)
		.success(function(data){
			$scope.tagData={};
			console.log(JSON.stringify(data));
		})
		.error(function(data){
			console.log('Error '+JSON.stringify(data));
		});
	};

});
shazamApp.controller('AdminController',function($scope, $http){
$scope.urlSongs='/api/v1/songs/';
$scope.urlTags='/api/v1/tags/';
$scope.songs=null;
$scope.tags=null;
$scope.songData={};

$http.get($scope.urlSongs)
.success(function(data){
	$scope.songs=data;
	console.log(JSON.stringify($scope.songs));
})
.error(function(data){
	console.log("Error "+JSON.stringify(data));
});

$http.get($scope.urlTags)
.success(function(data){
	$scope.tags=data;
	console.log(JSON.stringify(data));
})
.error(function(data){
	$scope.tags=data;
	console.log(JSON.stringify(data));
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
	};

	$scope.deleteSong=function(id){
		console.log("SONG ID IS " +id)
		$http.delete($scope.urlSongs+id)
		.success(function(data){
			$scope.songs=data;
			console.log(JSON.stringify(data));
		})
		.error(function(data){
			console.log("Error "+JSON.stringify(data));
		});
	};
	$scope.deleteTag=function(id){
		console.log("TAG ID IS "+id);
		$http.delete($scope.urlTags+id)
		.success(function(data){
			$scope.tags=data;
			console.log(JSON.stringify(data));
		})
		.error(function(data){
			console.log("Error "+JSON.stringify(data));
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
