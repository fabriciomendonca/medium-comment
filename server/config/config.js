const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  const configJSON = require('./config.json');
  Object.keys(configJSON[env]).forEach(key => {
    process.env[key] = configJSON[env][key];
  });
}

module.exports = {
  env
};