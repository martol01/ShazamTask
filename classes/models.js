var mongoose=require('mongoose');
var Schema= mongoose.Schema;
var mongoUri=process.env.MONGOLAB_URI||process.env.MONGOHQ_URL||"mongodb://localhost/shazamTask";
mongoose.connect(mongoUri);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
	console.log("CONNECTION SUCCESSFUL");
});
var TagSchema=new Schema({
	installation:{
		accountId: String,
		deviceModel: String
	},
	timestamp: Date,
	geolocation: {
		region:{
			locality: String,
			country: String
		},
		latitude: Number,
		longitude: Number
	},
	match: {
		track: {
			id: Number,
			metadata:{
				trackTitle: String,
				artistName: String
			}
		}
	}
	
});
var SongSchema=new Schema({
	trackId: Number,
	title: String,
	artist:
	{
		name: String
	},
	genre: {
		name: String
	},
	images:{
		image100: String,
		image100ios: String,
		image400: String,
		image400ios: String,
	},
	rdio: {
		weburl: String
	}
});

module.exports = {
    Tag: mongoose.model('Tag', TagSchema),
    Song: mongoose.model('Song', SongSchema)
};

 