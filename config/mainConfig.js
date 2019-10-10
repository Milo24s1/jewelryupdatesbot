const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    app_token:process.env.app_token,
    app_id:process.env.app_id,
    app_secret:process.env.app_secret,
    redirect_uri:process.env.redirect_uri,
    dbPassword:process.env.dbPassword,


};