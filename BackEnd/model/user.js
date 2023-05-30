var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt");

var userDB = {

	loginUser: function (email, password, callback) {

		var conn = db.getConnection();

		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("Connected!");

				var sql = 'select * from users where email = ?';
				conn.query(sql, [email], async function (err, result) {
					conn.end();
					if (err) {
						console.log("Err: " + err);
						return callback(err, null, null);

					} else {
						console.log(result)
						var token = "";
						if (result.length == 1) {
							var storedPassword = JSON.stringify(result[0].password).slice(1,-1);// removethe " and "
							let isMatch = await bcrypt.compare(password,storedPassword); // matches the password
							if (isMatch){
								token = jwt.sign({ id: result[0].id }, config.key, {
									expiresIn: 7200 //expires in 2 hrs
								});
								console.log("@@token " + token);
								return callback(null, token, result);
							}else{
								console.log("email/password does not match");
								var err2 = new Error("Email/Password does not match.");
								err2.statusCode = 404;
								return callback(err2, null, null);
							}
						} //if(res)
						else {
							console.log("email/password does not match");
							var err2 = new Error("Email/Password does not match.");
							err2.statusCode = 404;
							return callback(err2, null, null);
						}
					}  //else
				});
			}
		});
	},

	updateUser: function (username, firstname, lastname, id, callback) {

		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			} else {
				console.log("Connected!");

				var sql = "update users set username = ?,firstname = ?,lastname = ? where id = ?;";

				conn.query(sql, [username, firstname, lastname, id], function (err, result) {
					conn.end();

					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						console.log("No. of records updated successfully: " + result.affectedRows);
						return callback(null, result.affectedRows);
					}
				})
			}
		})
	},

	addUser: function (username, email, password, profile_pic_url, role, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			} else {
				console.log("Connected!");
				var sql = "Insert into users(username,email,password,profile_pic_url,role) values(?,?,?,?,?)";
				conn.query(sql, [username, email, password, profile_pic_url, role], function (err, result) {
					conn.end();

					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}
				});

			}
		});
	},
	// Unlimited logins stopper hehe 
	checkIPBan: function (ipAddr, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("Connected!");
				var sql = 'select * from ban_ip where ip_address = ?';
				conn.query(sql, [ipAddr], function (err, result) {
					conn.end();
					if (err) {
						console.log("Err: " + err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}  //else
				});
			}
		});
	},
	updateIPBan: function (tries,time,ipAddr, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			} else {
				var sql = "update ban_ip set tries = ?, time_banned = ? where ip_address = ?;";
				conn.query(sql, [tries,time,ipAddr], function (err, result) {
					conn.end();
					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						console.log("No. of records updated successfully: " + result.affectedRows);
						return callback(null, result.affectedRows);
					}
				});
			}
		});
	},
	addIPBan: function (ipAddr, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			} else {
				var sql = "Insert into ban_ip (ip_address,tries,time_banned) values(?,1,0);";
				conn.query(sql, [ipAddr], function (err, result) {
					conn.end();
					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}
				});
			}
		});
	},
	removeIPBan: function (ipAddr, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			} else {
				var sql = "update ban_ip set tries = 0, time_banned = 0 where ip_address = ?";
				conn.query(sql, [ipAddr], function (err, result) {
					conn.end();

					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}
				});

			}
		});
	},
};


module.exports = userDB;