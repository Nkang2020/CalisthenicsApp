var mongoose = require('mongoose');

var calisthenicsSchema = new mongoose.Schema({
	title: String,
	video: String,
	description: String,
	created: {type: Date, default: Date.now},
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	comments: [
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

module.exports = mongoose.model('Calisthenics', calisthenicsSchema);