const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    app_token:process.env.app_token,
    app_id:process.env.app_id,
    app_secret:process.env.app_secret,
    redirect_uri:process.env.redirect_uri,
    dbPassword:process.env.dbPassword,
    redirect_url:process.env.redirect_url,
    oauth_consumer_key:process.env.oauth_consumer_key,
    consumer_secret:process.env.consumer_secret,
    oauth_token:process.env.oauth_token,
    oauth_token_secret:process.env.oauth_token_secret,
    user_access_token:process.env.user_access_token,
    user_access_token_secret:process.env.user_access_token_secret,


};