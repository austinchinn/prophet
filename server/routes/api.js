var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../../config/database');
require('../../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../../models/user");
var Leaderboard = require("../../models/leaderboard");
var Standings = require("../../models/standings");
var jwtDecode = require('jwt-decode');

router.get('/', function(req, res, next) {
	res.send('Express RESTful API');
});

// pass username and password
// returns message
router.post('/register', function(req, res) {
	if (!req.body.username || !req.body.password) {
		res.json({success: false, msg: 'Username or password missing'});
	} else {
		if(!/^[a-zA-Z0-9_]{1,16}$/.test(req.body.username)){
			return res.json({success: false, msg: 'Invalid username'});
		}

		var newUser = new User({
			username: req.body.username,
			lowercasename: req.body.username.toLowerCase(),
			password: req.body.password,
			picks: {
				'naTeams':[{'name':'100 Thieves','abbr':'100'},{'name':'Cloud 9','abbr':'c9'},{'name':'Clutch Gaming','abbr':'cg'},{'name':'Counter Logic Gaming','abbr':'clg'},{'name':'Flyquest','abbr':'fly'},{'name':'Echo Fox','abbr':'fox'},{'name':'Golden Guardians','abbr':'ggs'},{'name':'Optic Gaming','abbr':'opt'},{'name':'Team Liquid','abbr':'tl'},{'name':'Team Solo Mid','abbr':'tsm'}],
				'euTeams':[{'name':'Excel Esports','abbr':'xl'},{'name':'Fnatic','abbr':'fnc'},{'name':'G2 Esports','abbr':'g2'},{'name':'Misfits Gaming','abbr':'msf'},{'name':'Origen','abbr':'og'},{'name':'Rogue','abbr':'rog'},{'name':'Schalke 04','abbr':'s04'},{'name':'SK Gaming','abbr':'sk'},{'name':'Splyce','abbr':'spy'},{'name':'Team Vitality','abbr':'vit'}]
			},
			leaderboards: ['all']
		});
		newUser.save(function(err) {
			if (err) {
				return res.json({success: false, msg: 'Username already exists'});
			}

			Leaderboard.findOne({
				code: 'all'
			}, function(err, leaderboard) {
				if (err) return res.send({success: false, msg: err});

				leaderboard.users.push(req.body.username);

				leaderboard.save(function(err) {
					if (err) return res.send({success: false, msg: err});

					res.json({success: true, msg: 'Successfully registered!'});
				});
			});	
		});
	}
});

// pass username and password
// returns token
router.post('/signin', function(req, res) {
	User.findOne({
		lowercasename: req.body.username.toLowerCase()
	}, function(err, user) {
		if (err) return res.send({success: false, msg: err});

		if (!user) {
			res.send({success: false, msg: 'Username not found'});
		} else {
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (isMatch && !err) {
					var token = jwt.sign(user.toJSON(), config.secret);
					res.json({success: true, token: 'bearer ' + token});
				} else {
					res.send({success: false, msg: 'Incorrect password'});
				}
			});
		}
	});
});

router.post('/getstandings', function(req, res) {
	Standings.findOne({
		name: 'standings'
	}, function(err, standings) {
		if (err) return res.send({success: false, msg: err});

		res.json({success: true, standings: standings.standings});
	});
});


// pass username
// returns picks
router.post('/getpicks', function(req, res) {
	User.findOne({
		username: req.body.username
	}, function(err, user) {
		if (err) return res.send({success: false, msg: err});

		if (!user) {
			res.send({success: false, msg: 'Username not found'});
		} else {
			res.json({success: true, picks: user.picks});
		}
	});
});

// pass username and picks
// returns token of updated user
router.post('/savepicks', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token && parseToken(token).username === req.body.username){
		User.findOne({
			username: req.body.username
		}, function(err, user) {
			if (err) return res.send({success: false, msg: err});
			
			user.picks = req.body.picks;
			user.save(function (err, updatedUser) {
				if (err) return res.send({success: false, msg: err});
				
				var token = jwt.sign(updatedUser.toJSON(), config.secret);
				res.json({success: true, token: 'bearer ' + token});
			});
		});
	}
	else {
		return res.status(403).send({success: false, msg: 'Unauthorized to make action'});
	}
});

// pass username and leaderboard name
// returns token of updated user
router.post('/createleaderboard', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token && parseToken(token).username === req.body.username){
		User.findOne({
			username: req.body.username
		}, function(err, user) {
			if (err) return res.send({success: false, msg: err});
			
			var code = Math.random().toString(36).substr(2, 6);

			if(!req.body.name || !req.body.username){
				return res.json({success: false, token: 'bearer ' + token});
			}

			var newLeaderboard = new Leaderboard({
				code: code,
				name: req.body.name.trim(),
				owner: req.body.username,
				users: [req.body.username]
			});

			newLeaderboard.save(function(err) {
				if (err) return res.send({success: false, msg: err});

				user.leaderboards.push(code);
				user.save(function (err, updatedUser) {
					if (err) return res.send({success: false, msg: err});

					var token = jwt.sign(updatedUser.toJSON(), config.secret);
					res.json({success: true, token: 'bearer ' + token});
				});
			});
		});
	}
	else {
		return res.status(403).send({success: false, msg: 'Unauthorized to make action'});
	}
});

// pass username and code
// returns message, and token if code is correct
router.post('/joinleaderboard', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token && parseToken(token).username === req.body.username){
		User.findOne({
			username: req.body.username
		}, function(err, user) {
			if (err) return res.send({success: false, msg: err});
	
			try{
				req.body.code = req.body.code.toLowerCase();
			}
			catch(err){
				return res.send({success: false, msg: err});
			}

			Leaderboard.findOne({
				code: req.body.code
			}, function(err, leaderboard) {
				if (err) return res.send({success: false, msg: err});

				if(!leaderboard){
					res.json({success: false, msg: 'Invalid code'});
				}
				else{
					if(leaderboard.users.includes(req.body.username)){
						res.json({success: false, msg: 'Already in leaderboard'});
					}
					else{
						leaderboard.users.push(req.body.username);

						leaderboard.save(function(err) {
							if (err) return res.send({success: false, msg: err});

							user.leaderboards.push(req.body.code);
							user.save(function (err, updatedUser) {
								if (err) return res.send({success: false, msg: err});

								var token = jwt.sign(updatedUser.toJSON(), config.secret);
								res.json({success: true, token: 'bearer ' + token, msg: 'Joined leaderboard!'});
							});
						});
					}
				}
			});
		});
	}
	else {
		return res.status(403).send({success: false, msg: 'Unauthorized to make action'});
	}
});

// pass in username and leaderboard code
// returns array of leaderboard names and codes that user is in
router.post('/getleaderboards', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token && parseToken(token).username === req.body.username){
		User.findOne({
			username: req.body.username
		}, function(err, user) {
			if (err) return res.send({success: false, msg: err});

			if (!user) {
				res.send({success: false, msg: 'Username not found'});
			} else {
				Leaderboard.find({ code: { $in: req.body.leaderboardCodes }}, function(err, leaderboards) {
					if (err) return res.send({success: false, msg: err});

					var leaderboardInfo = [];
					for(var i = 0; i < leaderboards.length; i++){
						leaderboardInfo.push({name:leaderboards[i].name,code:leaderboards[i].code,owner:leaderboards[i].owner});
					}
					res.json({success: true, results: leaderboardInfo});
				});
			}
		});
	}
	else {
		return res.status(403).send({success: false, msg: 'Unauthorized to make action'});
	}
});

// pass in leaderboard code
// return usernames and picks of users in leaderboard
router.post('/getleaderboard', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token){
		Leaderboard.findOne({
			code: req.body.code
		}, function(err, leaderboard) {
			if (err) return res.send({success: false, msg: err});

			if (!leaderboard) {
				res.send({success: false, msg: 'Invalid code'});
			} else {
				User.find({ username: { $in: leaderboard.users }}, function(err, users) {
					if(err) return res.send({success: false, msg: err});

					var userInfo = [];
					for (var i = 0; i < users.length; i++){
						userInfo.push({username:users[i].username,picks:users[i].picks});
					}
					res.json({success: true, results: userInfo});
				});
			}
		});
	}
	else {
		return res.status(403).send({success: false, msg: 'Unauthorized to make action'});
	}
});

// pass in leaderboard code
// return response
router.post('/deleteleaderboard', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token){
		Leaderboard.findOne({
			code: req.body.code
		}, function(err, leaderboard) {
			if (err) res.send({success: false, msg: err});

			if (!leaderboard) {
				res.send({success: false, msg: 'Invalid code'});
			} else {
				if(parseToken(token).username !== leaderboard.owner){
					return res.status(403).send({success: false, msg: 'Unauthorized to make action'});
				}
				else{
					var tempUsers = leaderboard.users;
					var tempCode = leaderboard.code;

					Leaderboard.deleteOne({
						_id: leaderboard._id
					}, function(err, response){
						if (err) res.send({success: false, msg: err});

						User.find({ username: { $in: tempUsers }}, function(err, users) {
							if(err) res.send({success: false, msg: err});

							// for (var i = 0; i < users.length; i++){
							// 	var temp = users[i].leaderboards.indexOf(tempCode);
							// 	if(temp > -1){
							// 		users[i].leaderboards.splice(temp,1);
							// 	}
							// 	users[i].save(function(err) {
							// 		if(err) res.send({success: false, msg: err});
							// 	});
							// }
							res.json({success: true, msg: 'Successfully deleted leaderboard'});	
						});	
					});
				}
			}
		});
	}
	else {
		return res.status(403).send({success: false, msg: 'Unauthorized to make action'});
	}
});

// pass in username and leaderboard code
// return message
router.post('/leaveleaderboard', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token && parseToken(token).username === req.body.username){
		User.findOne({
			username: req.body.username
		}, function(err, user) {
			if (err) res.send({success: false, msg: err});

			if (!user) {
				res.send({success: false, msg: 'Username not found'});
			} else {
				Leaderboard.findOne({ code: req.body.code }, function(err, leaderboard) {
					if (err) res.send({success: false, msg: err});

					if (!leaderboard) {
						res.send({success: false, msg: 'Leaderboard not found'});
					} 
					else {
						if(leaderboard.users.includes(req.body.username) && user.leaderboards.includes(req.body.code)){
							var temp = leaderboard.users.indexOf(req.body.username);
							leaderboard.users.splice(temp,1);

							leaderboard.save(function(err) {
								if(err) return res.send({success: false, msg: err});

								temp = user.leaderboards.indexOf(req.body.code);
								user.leaderboards.splice(temp,1);

								user.save(function(err, updatedUser) {
									if(err) return res.send({success: false, msg: err});

									var token = jwt.sign(updatedUser.toJSON(), config.secret);
									res.json({success: true, msg:'Left leaderboard', token: 'bearer ' + token});
								});
							});	
						}
						else{
							res.send({success: false, msg: 'User not in leaderboard'})
						}
					}
				});
			}
		});
	}
	else {
		return res.status(403).send({success: false, msg: 'Unauthorized to make action'});
	}
});

getToken = function (headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};

parseToken = function (token) {
	try{
		return jwtDecode(token);
	}
	catch(err){
		return null;
	}
	

}
module.exports = router;