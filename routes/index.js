const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const fs = require('fs');
const Votes = require('../models/models').Votes

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    console.log(req.user)
    return next();
  }
});

const ini_state = {
  "Iceland": 0,
  "Cankun": 0,
  "Machu Pichu": 0,
  "Canada": 0,
  "Tokyo (Request by Mufei)": 0
};
var count = 5;
var curr_state = Object.assign(ini_state);

var allowed_pw = [];
var voted = {};

function generate_hash() {
  // allowed_pw = ["q", "w", "e", "r", "t"];
  for (var i = 0; i < 5; i ++) {
    allowed_pw.push(crypto.randomBytes(20).toString('hex'));
    console.log('hash', i, allowed_pw[i]);
  }
}

function get_majority(obj) {
  var c = {};
  var d;
  var m = 0;
  Object.keys(obj).forEach((k) => {
    if (obj[k] > m) {
      m = obj[k];
      d = k;
    }
    c[obj[k]] = c[obj[k]] ? c[obj[k]] + 1 : 1;
  });
  return c[m] === 1 ? d : false;
}

router.get('/index', (req, res) => {
  
  // Votes.findOne({name: req.body.name, password:hashPassword(req.body.password)}, function(err, found) {
  //     res.redirect('/index');
  // })
  res.render('index',{ title: 'Parallel Vote'});
})


router.post('/passphrase', (req, res, next) => {
  console.log(req);
  var pw_received = req.body.pw;
  if (allowed_pw.indexOf(pw_received) > -1) {
    if (voted.hasOwnProperty(pw_received)) {
      res.status(200).send("voted");
      res.end();
      return
    }
    res.status(200).send("ok");
  } else {
    res.status(200).send("invalid");
  }
  res.end();
});

router.get('/count', (req, res, next) => {
  res.status(200).send(JSON.stringify(count));
  res.end();
});

router.post('/choose', (req, res, next) => {
  var pw = req.body.pw;
  var choices = JSON.parse(req.body.choices);
  if (voted[pw]) {
    res.status(400).send("someone already voted");
    return
  }
  choices.forEach((choice) => {
    console.log("****************************")
    console.log("voted", choice);
    console.log("****************************")
    curr_state[choice] += 1;
  });
  voted[pw] = true;
  count --;
  if (count === 0) {
    res.status(200).send("done");
  } else {
    res.status(200).send(JSON.stringify(count));
    res.end();
  }
});

router.get('/reset', (req, res, next) => {
  generate_hash();
  count = 5;
  voted = {};
  curr_state = JSON.parse(JSON.stringify(ini_state));
  res.redirect('/');
})

router.get('/results', (req, res, next) => {
  console.log(curr_state);
  var r = get_majority(curr_state);
  if (r) {
    res.status(200).send(JSON.stringify(r));
  } else {
    res.status(200).send("Do not converge.");
  }
  
  res.end();
})

module.exports = router;
