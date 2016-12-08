var express = require('express');
var router = express.Router();
var _ = require('lodash');
var jsonReader = require('../utils/jsonReader');

router.get('/', function (req, res) {

  var currentStep = req.query.step; //todo add validations
  var currentUser = req.session.user;


  //find cluster
  var file = 'db/cluster.json';
  var proccessTemplateFile = 'db/processTemplate.json';

  if (currentUser.department) {
    jsonReader(file, function (err, data) {
      var clusters = JSON.parse(data);
      //todo cache select
      var cluster = _.find(clusters, function(el) {
        return el.department === currentUser.department && el.role === currentUser.role;
      });

      jsonReader(proccessTemplateFile, function (err, data) {
        var template = JSON.parse(data);

        //todo cache select
        if (cluster) {
          var linkedProcess = _.find(template, function(el) {
            return el.id === cluster.referenceTemplate;
          });
        }


        res.json({
          actions: _.isEmpty(linkedProcess.data.steps[currentStep]) ? [] : linkedProcess.data.steps[currentStep].actions,
          nextStep: linkedProcess.data.steps[++currentStep]
        });

      });


    });
  } else {
    //if demo user without department and role
    res.json({
      actions: []
    });
  }









});

module.exports = router;
