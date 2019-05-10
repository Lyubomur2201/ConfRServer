let config = {};

config.DOMAIN = process.env.PORT || '0.0.0.0';
config.PORT = process.env.PORT || 5000;

config.MONGODB_ATLAS_PSW = 'ESzMa9pzLfB7Ycq4';
config.MONGODB_ATLAS_USER = 'Admin';

config.JWT_SECRET = 'Secret';

config.GOOGLE_CLIENT_ID = '230064233896-oi75do762lihf8phbp5bq7t7oif1lpm6.apps.googleusercontent.com';
config.GOOGLE_CLIENT_SECRET = 'xUdU37eSzPC1-FgCI6qFHNP9';

config.FACEBOOK_CLIENT_ID = '2367214036868822';
config.FACEBOOK_CLIENT_SECRET = '351e7055cdc6682eb776ba42f89d00bf';

config.MAILGUN_API_KEY = '51038dbcb72ec548783b00a6ec3ecbc2-e566273b-06518be9';
config.MAILGUN_DOMAIN = 'sandbox0f385d18eabd42459e559dc12ab6e6ac.mailgun.org';

module.exports = config;