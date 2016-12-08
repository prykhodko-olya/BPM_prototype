var express = require('express');
var router = express.Router();

/* GET index page. */

router.get('/:id', function(req, res) {

  console.log(req.params.id);

  res.render('project');
});

module.exports = router;
