
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var app = express();
var path= require('path');
var SongModel=require('./classes/models').Song;
var TagModel=require('./classes/models').Tag;


// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.post('/api/v1/songs', function(req,res){//create a new song
	SongModel.create({
		trackId: req.body.trackId,
		title: req.body.title,
		artist: {
			name: req.body.artist.name
		},
		genre: {
			name: req.body.genre.name
		},
		images: {
			image100: req.body.images.image100,
			image100ios: req.body.images.image100ios,
			image400: req.body.images.image400,
			image400ios: req.body.images.image400ios
		},
		rdio:{
			weburl: req.body.rdio.weburl
		}
	}, function(err, song){
		if(err)
			res.send(err);
		SongModel.find(function(err, songs){
			if(err)
				res.send(err);
			res.json(songs);
		});
	});
});

app.post('/api/v1/tags', function(req,res){//create a new song
	TagModel.create({
		installation: {
			accountId: req.body.installation.accountId,
			deviceModel: req.body.installation.deviceModel
		},
		timestamp: req.body.timestamp,
		geolocation: {
			region: {
				locality: req.body.geolocation.region.locality,
				country: req.body.geolocation.region.country
			},
			latitude: req.body.geolocation.latitude,
			longitude: req.body.geolocation.longitude
		},
		match: {
			track:{
				trackId: req.body.match.track.trackId,
				metadata: {
					trackTitle: req.body.match.track.metadata.trackTitle,
					artistName: req.body.match.track.metadata.artistName
				}
			}
		}
	}, function(err, tag){
		if(err)
			res.send(err);
		TagModel.find(function(err, tags){
			if(err)
				res.send(err);
			res.json(tags);
		});
	});
});

app.get('/api/v1/tags', function(req,res){
	TagModel.find(function(err, tags){
		if(err)
			res.send(err);
		res.json(tags);
	});
});

app.get('/api/v1/songs', function(req,res){//get all songs
	SongModel.find(function(err, songs){
		if(err)
			res.send(err);
		res.json(songs);
	});
});

app.put('/api/v1/songs/:_id', function(req,res){ //update a song by id
	SongModel.update({_id:req.params._id},{$set: {url:req.body.url}}, function(err, song){
		if(err)
			res.send(err);
		SongModel.find(function(err,songs){
			if(err)
				res.send(err);
			res.json(songs);
		});
	});
});
app.delete('/api/v1/songs/:_id', function(req,res){//delete a song
	SongModel.remove({_id:req.params._id}, function(err,song){
		if(err)
			res.send(err);
		SongModel.find(function(err, songs){
			if(err)
				res.send(err);
			res.json(songs);
		});
	});
});
app.delete('/api/v1/tags/:_id', function(req,res){
	TagModel.remove({_id:req.params._id}, function(req,res){
		if(err)
			res.send(err);
		TagModel.find(function(err, tags){
			if(err)
				res.send(err);
			res.json(tags);
		});
	});
});

app.get('/api/v1/songs/:artist', function(req,res){
	SongModel.find({artist: req.params.artist}, function(err,songs){
		if(err)
			res.send(err);
		res.json(songs);
	});
});
app.get('/', function(req,res){
	res.sendfile("./public/index.html")
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
