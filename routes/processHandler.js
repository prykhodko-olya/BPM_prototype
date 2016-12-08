var express = require('express');
var router = express.Router();
var jsonReader = require('../utils/jsonReader');
var _ = require('lodash');
var jsonfile = require('jsonfile');


router.post('/', function(req, res) {

  var form = req.body;
  var file = 'db/processTemplate.json';

  jsonReader(file, function (err, data) {
    if (err) throw err;
    var currentFileData = JSON.parse(data);

    var newProcessEntity = {id: Date.now(), data: {}};
    newProcessEntity.data = form;

    currentFileData.push(newProcessEntity);

    console.log(currentFileData);

    jsonfile.writeFile(file, currentFileData, function (err) {
      if (err) throw new Error(err);

      res.json(newProcessEntity.id);
    })

  });

});

module.exports = router;
