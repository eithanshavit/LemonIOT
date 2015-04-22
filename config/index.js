var nconf = require('nconf');
// Setup nconf to use (in-order):
//   1. Command-line arguments
nconf.argv();
//   2. Environment variables
nconf.env();
//   3. Some defaults
nconf.defaults({
  'ENV': 'dev',
});

