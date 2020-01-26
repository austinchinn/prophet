var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var router = express.Router();
var User = require('./models/user');
var Standings = require('./models/standings');

var api = require('./server/routes/api');
var app = express();

mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { promiseLibrary: require('bluebird'), useNewUrlParser: true, useCreateIndex: true })
	.catch((err) => console.error(err));

app.set('views', './views');
app.locals.basedir = app.get('views');
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/mypicks', express.static(path.join(__dirname, 'dist')));
app.use('/login', express.static(path.join(__dirname, 'dist')));
app.use('/leaderboards', express.static(path.join(__dirname, 'dist')));
app.use('/user/:username', function(req,res) {
	User.findOne({
		lowercasename: req.params.username.toLowerCase()
	}, function(err, user) {
		if (err) res.send('error');

		if (!user) {
			res.render('notfound', {username: req.params.username});
		}
		else{
			Standings.findOne({
				name: 'standings'
			}, function(err, standings){
				if (err) res.send('error');

				var points = 0;
				var standings = standings.standings;
				var naPlacements = [];
				var euPlacements = [];

				var naTeams = [];
				var euTeams = [];

				for(var i = 0; i < 10; i++){
					var naRecord = '';
					var euRecord = '';
					for(var j = 0; j < 10; j++){
						if(standings.naTeams[j].teams.indexOf(user.picks.naTeams[i].name.toUpperCase()) > -1){
							naRecord = standings.naTeams[j].record;
							naPlacements.push(j+1);
							break;
						}
					}
					for(var j = 0; j < 10; j++){
						if(standings.euTeams[j].teams.indexOf(user.picks.euTeams[i].name.toUpperCase()) > -1){
							euRecord = standings.euTeams[j].record;
							euPlacements.push(j+1);
							break;
						}
					}
					naTeams.push({
						'name':user.picks.naTeams[i].name,
						'abbr':user.picks.naTeams[i].abbr,
						'record':naRecord,
						'correct':false
					});
					euTeams.push({
						'name':user.picks.euTeams[i].name,
						'abbr':user.picks.euTeams[i].abbr,
						'record':euRecord,
						'correct':false
					});
				}

				for(var j = 0; j < 10; j++){
					if(standings.naTeams[j].teams.indexOf(naTeams[j].name.toUpperCase()) > -1){
						points += 2;
						naTeams[j].correct = true;
					}
					if(standings.euTeams[j].teams.indexOf(euTeams[j].name.toUpperCase()) > -1){
						points += 2;
						euTeams[j].correct = true;
					}
				}
				res.render('picks', {username: user.username, points:points, naPlacements: naPlacements, euPlacements: euPlacements, naTeams: naTeams, euTeams: euTeams});
			})
		}
	});
});
app.use('/api', api);

app.use(passport.initialize());

app.use(function(req, res) {
	res.redirect('/');
});

module.exports = app;