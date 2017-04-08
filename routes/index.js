var express = require('express');
var router = express.Router();
const ini_state = {
                  "Iceland": 0,
                  "Cankun": 0,
                  "Machu Pichu": 0,
                  "Canada": 0
};
var count = 5;
var curr_state = Object.assign(ini_state);
var crypto = require("crypto");
var allowed_pw = [];
var voted = {};

function generate_hash() {
  allowed_pw = ["q", "w", "e", "r", "t"];
  // for (var i = 0; i < 5; i ++) {
  //   allowed_pw.push(crypto.randomBytes(20).toString('hex'));
  //   console.log('hash', i, allowed_pw[i]);
  // }
}

function get_majority(obj) {
  var c = {};
  var d;
  var m = 0;
  Object.keys(obj).forEach(function(k){
    if (obj[k] > m) {
      m = obj[k];
      d = k;
    }
    c[obj[k]] = c[obj[k]] ? c[obj[k]] + 1 : 1;
  });
  return c[m] === 1 ? d : false;
}

generate_hash();

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
  res.status(200).send(JSON.stringify(count));
  res.end();
});

router.post('/choose', function(req, res, next) {
  var choices = JSON.parse(req.body.choices);
  choices.forEach(function(choice){
    console.log("****************************")
    console.log("voted", choice);
    console.log("****************************")
    curr_state[choice] += 1;
  });
  count --;
  if (count === 0) {
    res.status(200).send("done");
  } else {
    res.status(200).send(JSON.stringify(count));
    res.end();
  }
});

router.get('/reset', function(req, res, next) {
  generate_hash();
  count = 5;
  voted = {};
  curr_state = Object.assign(ini_state);
  res.redirect('/');
})

router.get('/results', function(req, res, next) {
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
