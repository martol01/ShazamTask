
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var app = express();
var path= require('path');
var SongModel=require('./classes/models');

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
		artist: req.body.artist,
		title: req.body.title,
		url: req.body.url,
		date: new Date()
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
