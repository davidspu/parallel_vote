var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/models').User;
var hashPassword = hashPassword || function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};
var allowed_invi = {"123": true};

module.exports = function(passport) {
    router.post('/signup', function(req, res, next) {
        var pw = req.body.password;
        var un = req.body.username;
        var pw_2 = req.body.password_2;
        var invi = req.body.invi_code;
        if (pw && pw_2) {
            if (pw === pw_2) {
                if (invi in allowed_invi) {
                    var user = new User({
                        username: un,
                        password: hashPassword(pw)
                    });
                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                            next();
                        } else {
                            res.redirect('/login');
                        }
                    });
                } else {
                    res.render('signup',{error:"Invalid Invitation Code"});
                }
            } else {
                res.render('signup',{error:"Password Mismatch"});
            }
        } else {
            res.render('signup',{error:"empty entry"});
        }
    });

    router.get('/signup', function(req, res, next) {
        res.render('signup');
    })

    router.get('/login', function(req, res) {
        res.render('login');
    })

    router.post('/login', passport.authenticate('local'), function(req, res) {
        if (req.body.username && req.body.password) {
            console.log(req.body)
            User.findOne({name: req.body.name, password:hashPassword(req.body.password)}, function(err, found) {
                res.redirect('/index');
            })
        } else {
            res.render('login', {error: "Need a valid username/password combination"})
        }
    });
    router.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/login');
    })


    return router;
}
