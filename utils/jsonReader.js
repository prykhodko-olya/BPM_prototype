var fs = require('fs');

function jsonReader(path, cb) {
  fs.readFile(path, 'utf8', cb);
}

module.exports = jsonReader;
