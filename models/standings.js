var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StandingsSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	standings: {
		type: Object,
		required: true
	}
});

module.exports = mongoose.model('standings', StandingsSchema);