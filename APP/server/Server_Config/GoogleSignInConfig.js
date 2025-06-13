const {OAuth2Client} = require('google-auth-library');


require('dotenv').config();

exports.googleSignInClient = new OAuth2Client(`${process.env.GOOGLE_AUTH_CLIENT_ID}`);