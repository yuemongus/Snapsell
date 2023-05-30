var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var user = require('../model/user.js');
var listing = require('../model/listing');
var offers = require('../model/offer');
var likes = require('../model/likes');
var images = require('../model/images')
var verifyToken = require('../auth/verifyToken.js');
//bcrypt
var bcrypt = require('bcrypt');
//logger
const logger = require('../logger/logger.js');

logger
var path = require("path");
var multer = require('multer')

var cors = require('cors');//Just use(security feature)

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.options('*', cors());//Just use
app.use(cors());//Just use
app.use(bodyParser.json());
app.use(urlencodedParser);
//Regex to filter < and > from instored text
function XSSCheck(text){
	return text.replace(/<|>|"|'|;|-|#|\/|\(|\)|`|~|\?|\\|,/g,'');
}

app.post('/user/login', function (req, res) {//Login
	var email = req.body.email;
	var password = req.body.password;
	// new code
	let ipaddr = req.socket.remoteAddress;
	user.checkIPBan(ipaddr,function(err,result2){
		if(err){
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.send(err);
		}else if (result2.length == 1){
			let time = result2[0].time_banned;
			let currentTime = Date.now();
			if (time >= currentTime){
				let min = Math.floor(((time - currentTime)/1000)/60);
				let sec = Math.floor(((time - currentTime)/1000)%60);
				res.json({success:false,time:`${min} Minutes ${sec} Seconds`});
				return;
			}
		}
		user.loginUser(email, password, function (err, token, result) {
			if (err) {
				if(err.statusCode = 404){
					res.status(401).send('Unauthorized');
					logger.error(`${err.status || 404} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

					if (result2.length == 1){
						let tries = result2[0].tries + 1
						let time = 0
						if (tries%5==0){
							time = Date.now() + 900000 + (tries/5 - 1)*300000; // 15min in milliseconds from the current time
						}
						user.updateIPBan(tries,time,ipaddr,function(err,result2){
							if(err){
								res.status(500).send('Internal Server Error');
								logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
							}else{
								res.status(201);
								logger.info(`IP Address IPBan Updated successfully:  Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip}| IP Address - ${ipaddr} | Tries - ${tries} | Time Banned - ${time} `);
							}
						})
					}else{
						user.addIPBan(ipaddr,function(err,result3){
							if(err){
								res.status(500).send('Internal Server Error');
								logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
							}else{
								res.status(201);
								logger.info(`IP Address IPBan Added successfully:  Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip}| IP Address - ${ipaddr} | Tries - 1 | Time Banned - 0 `);
							}
						})
					}
				}else{
					res.status(500);
					res.send(err.statusCode);
				}
			} else {
				let ipaddr = req.socket.remoteAddress
				user.removeIPBan(ipaddr,function(err,result4){
					if(err){
						res.status(500).send('Internal Server Error');
						logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
					}else{
						res.status(201);
						logger.info(`IP Address IPBan Removed successfully:  Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip}| IP Address - ${ipaddr} | Tries - 0 | Time Banned - 0 `);
					}
				})
				res.statusCode = 201;
				res.setHeader('Content-Type', 'application/json');
				delete result[0]['password'];//clear the password in json data, do not send back to client
				logger.info(`User logged in successfully:  Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | ID - ${result[0].id} | Username - ${result[0].username} | Email - ${result[0].email} `);
				res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
			}
		});
	});
});

app.post('/user',verifyToken.verify, async function (req, res) {//Create User
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var profile_pic_url = req.body.profile_pic_url
	var role = req.body.role
	console.log(username)
	var pswdRequirement = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#_\$-%\^&\*])(?=.{8,})");
	if(pswdRequirement.test(password)){
		let salt = await bcrypt.genSalt(10)
		let hashedPassword = await bcrypt.hash(password, salt)
		user.addUser(username, email, hashedPassword, profile_pic_url, role, function (err, result) {
			if (err) {
				res.status(500).send('Internal Server Error');
				logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
				res.send(err);
			} else {
				res.status(201);
				res.setHeader('Content-Type', 'application/json');
				logger.info(`User created successfully: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | Username - ${req.body.username} | Email - ${req.body.email} |  Profile Picture URL - ${req.body.profile_pic_url} | Role - ${req.body.role}`);
				res.send(result);
			}
		});
	}
	else{
		res.status(422).send({"Message": "Password is weak, please ensure that there is atleast 8 characters and contains a capital and small letter, number, and a symbol."});
	}
});

app.post('/user/logout',verifyToken.blackList, function (req, res) {//Logout
	console.log("..logging out.");
	res.clearCookie('session-id'); //clears the cookie in the response
	res.setHeader('Content-Type', 'application/json');
	logger.info(`User logged out successfully: Exception - ${req.exception} | Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip}`);
	res.json({ success: true, status: 'Log out successful!' });

});


app.put('/user/update/', verifyToken.verify, function (req, res) {//Update user info
	var id = req.id
	var username = XSSCheck(req.body.username);
	var firstname = XSSCheck(req.body.firstname);
	var lastname = XSSCheck(req.body.lastname);
	user.updateUser(username, firstname, lastname, id, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(200);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`User updated successfully: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | Username - ${req.body.username} | First Name - ${req.body.firstname} |  Last Name - ${req.body.lastname}`);
			res.json({ success: true })
		}
	});
});

//Listing APIs
app.post('/listing/', verifyToken.verify, function (req, res) {//Add Listing
	var title = XSSCheck(req.body.title);
	var category = XSSCheck(req.body.category);
	var description = XSSCheck(req.body.description);
	var price = req.body.price;
	var fk_poster_id = req.id;
	listing.addListing(title, category, description, price, fk_poster_id, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false });
		} else {
			res.status(201);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Listing added successfully: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | Title - ${req.body.title} | Category - ${req.body.category} |  Description - ${req.body.description} | Price - ${req.body.price} | Poster ID - ${req.id}`);
			res.json({ success: true,id:result.insertId })
		}
	});
});


app.get('/user/listing', verifyToken.verify, function (req, res) {//Get all Listings of the User
	var userid = req.id;
	listing.getUserListings(userid, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			console.log(err)
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false });
		} else {
			res.status(200);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Listing retrieved successfully: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | ID - ${req.id}`);
			res.json({ success: true, result: result });
		}
	});
});

app.get('/listing/:id',verifyToken.verify, function (req, res) {//View a listing
	var id = req.params.id
	listing.getListing(id, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(200);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Listing has been viewed: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | ID - ${req.params.id} | Title - ${result[0].title} | Category - ${result[0].category} | Description - ${result[0].description} | Price - ${result[0].price} | Poster username - ${result[0].username} | Poster ID - ${result[0].fk_poster_id} | Image - ${result[0].name}`);
			res.json({ success: true, result: result })
		}
	});
});

app.get('/search/:query', verifyToken.verify, function (req, res) {//View all other user's listing that matches the search
	var query = XSSCheck(req.params.query);
	var userid = req.id;
	listing.getOtherUsersListings(query, userid, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(200);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Listing has been searched: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | Query - ${req.params.query} | ID - ${req.id}`);
			res.json({ success: true, result: result })
		}
	});
});

app.put('/listing/update/',verifyToken.verify, function (req, res) {//View a listing
	var title = XSSCheck(req.body.title);
	var category = XSSCheck(req.body.category);
	var description = XSSCheck(req.body.description);
	var price = req.body.price;
	var id = req.body.id;
	listing.updateListing(title, category, description, price, id, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(200);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Listing has been updated successfully: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | ID - ${req.body.id} | Title - ${req.body.title} | Category - ${req.body.category} | Description - ${req.body.description} | Price - ${req.body.price}`);
			res.json({ success: true })
		}
	});
});

app.delete('/listing/delete/',verifyToken.verify, function (req, res) {//View a listing
	var id = req.body.id;

	listing.deleteListing(id, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(200);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Listing has been deleted successfully: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | ID - ${req.body.id}`);
			res.json({ success: true })
		}
	});
});

//Offers API
app.post('/offer/', verifyToken.verify, function (req, res) {//View a listing
	var offer = req.body.offer;
	var fk_listing_id = req.body.fk_listing_id;
	var fk_offeror_id = req.id;
	var status = "pending";
	offers.addOffer(offer, fk_listing_id, fk_offeror_id, status, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(201);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Offer have been successfully sent: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | ID - ${req.id} | Offer - ${req.body.offer} | Listing ID - ${req.body.fk_listing_id} | Offeror ID - ${req.id}`);
			res.json({ success: true })
		}
	});
});

app.get('/offer/', verifyToken.verify, function (req, res) {//View all offers
	var userid = req.id
	offers.getOffers(userid, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(201);
			res.setHeader('Content-Type', 'application/json');
			console.log(result)
			logger.info(`All offers have been retrieved successfully: Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | ID - ${req.id}`);
			res.json({ success: true, result: result })
		}
	});
});

app.post('/offer/decision/',verifyToken.verify, function (req, res) {//View all offers
	var status = req.body.status;
	var offerid = req.body.offerid;
	offers.AcceptOrRejectOffer(status, offerid, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(201);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Offer status : Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | Order ID - ${req.body.offerid} | Offer Status - ${req.body.status}`);
			res.json({ success: true })
		}
	});
});

app.get('/offer/status/', verifyToken.verify, function (req, res) {//View all offers
	var userid = req.id
	offers.getOfferStatus(userid, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(201);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Offer status : Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | User ID - ${req.id}`);
			res.json({ success: true, result: result })
		}
	});
});

//Likes API
app.post('/likes/', verifyToken.verify, function (req, res) {//View all offers
	var userid = req.id
	var listingid = req.body.listingid;
	likes.insertLike(userid, listingid, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(201);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Listing has been liked : Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | User ID - ${req.id} | Listing ID - ${req.body.listingid}`);
			res.json({ success: true })
		}
	});
});

app.get('/likeorunlike/:listingid/', verifyToken.verify, function (req, res) {//Like or Unlike
	var userid = req.id
	var listingid = req.params.listingid;
	likes.checklike(userid, listingid, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(200);
			if (result.length == 0) {
				likes.insertLike(userid, listingid, function (err, result) {
					if (err) {
						res.status(500).send('Internal Server Error');
						logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
						res.json({ success: false })
					} else {
						res.status(201);
						res.setHeader('Content-Type', 'application/json');
						logger.info(`Listing has been liked : Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | User ID - ${req.id} | Listing ID - ${req.params.listingid}`);
						res.json({ success: true, action: "liked" })
					}
				});
			} else {
				likes.deleteLike(userid, listingid, function (err, result) {
					if (err) {
						res.status(500).send('Internal Server Error');
						logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
						res.json({ success: false })
					} else {
						res.status(200);
						logger.info(`Listing has been unliked : Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | User ID - ${req.id} | Listing ID - ${req.params.listingid}`);
						res.json({ success: true, action: "unliked" })
					}
				});
			}
		}
	});
});

app.get('/likes/:listingid/',verifyToken.verify, function (req, res) {//View all offers
	var listingid = req.params.listingid;
	likes.getLike(listingid, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({ success: false })
		} else {
			res.status(200);
			res.setHeader('Content-Type', 'application/json');
			logger.info(`Amount of likes has been retrieved : Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | Listing ID - ${req.params.listingid}`);
			res.json({ success: true, amount: result.length })
		}
	});
});

//Images API

let storage = multer.diskStorage({
	destination: function (req, file, callback) {

		callback(null, __dirname + "/../public")
	},
	filename: function (req, file, cb) {
		req.filename = file.originalname.replace(path.extname(file.originalname), '') + '-' + Date.now() + path.extname(file.originalname);
		cb(null, req.filename);
		
	}
});

let upload = multer({
	storage: storage, limits: { fileSize: 2 * 1024 * 1024 }
});//limits check if he file size is equal to or below 5mb


app.post('/images/:fk_product_id/',verifyToken.verify, upload.single('myfile'), function (req, res) {
	var fk_product_id = req.params.fk_product_id;
	var name = req.filename;
	images.uploadImage(name,fk_product_id, function (err, result) {
		if (err) {
			res.status(500).send('Internal Server Error');
			logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			res.json({success:false});
		} else {
			res.status(201);
			logger.info(`Image has been uploaded : Request URL - ${req.originalUrl} | Request Method - ${req.method} | Request IP - ${req.ip} | Product ID - ${req.params.fk_product_id} | Filename - ${req.filename}`);
			res.json({success:true});
		}
	});
});
module.exports = app;