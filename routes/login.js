var express = require('express');
var router = express.Router();
var jsonReader = require('../utils/jsonReader');
var _ = require('lodash');

/* GET login page. */

router.get('/', function(req, res) {

  if (req.session.token) {
    return res.redirect('/home');
  }

  res.render('login');
});

router.post('/', function(req, res) {

  jsonReader('db/users.json', function (err, data) {
    if (err) throw err;
    var users = JSON.parse(data);

    var currentUser = _.find(users, function(user) {
      return user.login === req.body.username  && user.password === req.body.password;
    });

    if (currentUser) {

      req.session.token = "user token";
      req.session.user = currentUser; //todo whole user store in session, security issues
      req.session.save();

      res.redirect('/home');
    } else {
      res.redirect('/login'); //todo add error messages
    }
  });

});

module.exports = router;
