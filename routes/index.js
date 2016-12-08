var express = require('express');
var router = express.Router();
var _ = require('lodash');
var jsonReader = require('../utils/jsonReader');

/* GET index page. */

router.get('/', function(req, res) {

  if (!req.session.token) {
    return res.redirect('/login');
  }

  var proccessTemplateFile = 'db/processTemplate.json';

  jsonReader(proccessTemplateFile, function (err, data) {
    var template = JSON.parse(data);

    console.log(data);

    res.render('home', {data: template});
  });


});

module.exports = router;
