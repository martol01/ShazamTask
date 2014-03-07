var mongoose=require('mongoose');
var Schema= mongoose.Schema;
var mongoUri=process.env.MONGOLAB_URI||process.env.MONGOHQ_URL||"mongodb://localhost/shazamTask";
mongoose.connect(mongoUri);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
	console.log("CONNECTION SUCCESSFUL");
});
var SongSchema=new Schema({
	artist: String,
	title: String,
	url: String,
	date: Date
});
module.exports=mongoose.model('Song', SongSchema);