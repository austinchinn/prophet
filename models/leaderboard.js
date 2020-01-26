var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LeaderboardSchema = new Schema({
	code: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	},
	users: {
		type: Array,
		required: true
	}
});

module.exports = mongoose.model('leaderboard', LeaderboardSchema);