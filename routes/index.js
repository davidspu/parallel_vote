var express = require('express');
var router = express.Router();
var models = require('../models');
var Talley = models.Talley;
var Pp = models.Pp;
const ini_state = {
                  iceland: 0,
                  cankun: 0,
                  machu: 0,
                  canada: 0,
                  count: 5
};

var curr_state = Object.assign(ini_state);
var crypto = require("crypto");
var id = crypto.randomBytes(20).toString('hex');
var allowed_pw = [];
var voted = {};

function generate_hash() {
  allowed_pw = [];
  for (var i = 0; i < 5; i ++) {
    allowed_pw.push(crypto.randomBytes(20).toString('hex'));
  }
}

generate_hash();
console.log(allowed_pw);

router.get('/', function(req, res) {
  res.render('index',{ title: 'Parallel Vote'});
})


router.post('/passphrase', function(req, res, next) {
  var pw_received = req.body.pw;
  if (allowed_pw.indexOf(pw_received) > -1) {
    if (voted.hasOwnProperty(pw_received)) {
      res.status(200).send("voted");
      res.end();
      return
    }
    voted[pw_received] = true;
    res.status(200).send("ok");
  } else {
    res.status(200).send("invalid");
  }
  res.end();
});

router.get('/count', function(req, res, next) {
  res.status(200).send(JSON.stringify(curr_state.count));
  res.end();
});

router.post('/choose', function(req, res, next) {
  var choice = req.body.choice;
  if (curr_state.hasOwnProperty(choice)) {
    curr_state[choice] += 1;
    curr_state.count --;
    res.status(200).send(JSON.stringify(curr_state.count));
    res.end();
  } else {
    res.end();
  }
});

router.get('/reset', function(req, res, next) {
  generate_hash();
  res.status(200).send(JSON.stringify(allowed_pw));
  res.end();
})

router.get('/results', function(req, res, next) {
  res.status(200).send(JSON.stringify(curr_state));
  res.end();
})

module.exports = router;
