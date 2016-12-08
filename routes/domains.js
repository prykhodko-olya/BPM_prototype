var express = require('express');
var router = express.Router();
var jsonReader = require('../utils/jsonReader');
var _ = require('lodash');


router.get('/', function(req, res) {

  jsonReader('db/domains.json', function (err, data) {
    if (err) throw err;
    var domains = JSON.parse(data);
    res.json(domains);
  });

});

module.exports = router;
