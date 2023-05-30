var jwt = require('jsonwebtoken');
var config = require('../config');

//store blaclistedtokens
var blackListedTokens = []

var verifyDB = {
    verify: function(req, res, next){ 
        var token = req.headers['authorization']; //retrieve authorization header's content
        if(!token || !token.includes('Bearer')){ 
        
           res.status(403);
           return res.send({auth:'false', message:'Not authorized!'});
        }else{
           token=token.split('Bearer ')[1]; //obtain the token's value
           jwt.verify(token, config.key, function(err, decoded){ //verify token
            if(err){
                res.status(403);
                console.log('Invalid')
                return res.end({auth:false, message:'Not authorized!'});
            }else{
                if(blackListedTokens.includes(token)){
                    res.status(403);
                    console.log('Invalid')
                    return res.end({auth:false, message:'Token is blacklisted!'});
                }else{
                    console.log('Valid')
                    req.id = decoded.id
                    next();
                }
            }
           });
        }
    },
    blackList: function(req, res, next){
        var token = req.headers['authorization']; //retrieve authorization header's content
        if(!token || !token.includes('Bearer')){ 
            next();
        }else{
            token=token.split('Bearer ')[1]; //obtain the token's value
            jwt.verify(token, config.key, function(err, decoded){ //verify token
            if(err){
                next();
            }else{
                blackListedTokens.push(token)
                console.log('Token blacklisted!')
                console.log(blackListedTokens)
                next();
            }
           });
        }
    },
}

module.exports = verifyDB;