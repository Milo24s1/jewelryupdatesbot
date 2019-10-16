const request = require('request');
const mainConfig = require('../../config/mainConfig');
const InterestController = {};
const Twitter = require('twitter-node-client').Twitter;

InterestController.fbRedirectHandle = function (req,res) {

    console.log("fbRedirectHandle: begin");
    const code = req.query.code;
    const app_secret = mainConfig.app_secret;
    const app_id = mainConfig.app_id;
    const redirect_uri = mainConfig.redirect_uri;

    if(code != null){
        const getOptions = {
            jar:true,
            followAllRedirects: true,
            url:`https://graph.facebook.com/v3.3/oauth/access_token?client_id=${app_id}&redirect_uri=${redirect_uri}&client_secret=${app_secret}&code=${code}`
        };

        try {
            request.get(getOptions,(error,response,html)=>{
                const jsonResponse = JSON.parse(html);
                const access_token = jsonResponse.access_token;
                console.log('fbRedirectHandle: access_token '+access_token);

                //set this as cookie variable
                res.cookie('access_token', access_token, {  path: '/', httpOnly:true ,expires: new Date(Date.now() + 90000000)});
                res.render('callback');
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        console.log('********** code error ******');
        const error_reason = req.params.error_reason;
        const error = req.params.error;
        const error_description = req.params.error_description;
        console.log(error_reason,error,error_description);
    }
};

InterestController.demoTest = function(req,res){

    res.render('fblogin', {
        app_id:mainConfig.app_id,
        redirect_uri:mainConfig.redirect_uri
    })
};


InterestController.dashboard = async function(req,res){

    const access_token = req.cookies['access_token'];
    if(access_token === undefined){
        // redirect to login button page
        res.redirect('/fblogin');
    }
    else {
        //check access token validity by calling fb end point
        const isTokenExpired = await this.isTokenExpired(access_token);
        console.log('dashboard :'+isTokenExpired);
        if(isTokenExpired){
            // redirect to login button page
            console.log('redirecting after token funciton');
            res.redirect('/fblogin');
        }
        else {
            // redirect to search page
            res.redirect('/search');
        }
    }
};


InterestController.fbInterestAPICall = function (req,res) {

    const access_token = req.cookies['access_token'];
    const searchTerm = req.body.searchTerm;
    console.log('fbInterestAPICall: searchTerm'+searchTerm);
    console.log('fbInterestAPICall: '+access_token);
    const getOptions = {
      jar: true,
      followAllRedirects: true,
      url: `https://graph.facebook.com/search?type=adinterest&q=[${searchTerm}]&limit=1000&locale=en_US&access_token=${access_token}`
    };

    try {
        request.get(getOptions,(err,response,body)=>{
            if(err){
                res.send({error:err});
            }
            else {
                res.send(JSON.parse(body));
            }
        });
    }
    catch (e) {
        res.status(500).send({error:e});
        console.log(e);
    }

};

InterestController.fbBehavioursAPICall = function (req,res) {

    const access_token = req.cookies['access_token'];
    const searchTerm = req.body.searchTerm;
    console.log('fbBehavioursAPICall: searchTerm'+searchTerm);
    console.log('fbBehavioursAPICall: '+access_token);
    const getOptions = {
      jar: true,
      followAllRedirects: true,
      url: `https://graph.facebook.com/search?type=adinterest&q=[${searchTerm}]&limit=1000&locale=en_US&access_token=${access_token}`
    };

    try {
        request.get(getOptions,(err,response,body)=>{
            if(err){
                res.send({error:err});
            }
            else {
                res.send(JSON.parse(body));
            }
        });
    }
    catch (e) {
        res.status(500).send({error:e});
        console.log(e);
    }

};

InterestController.isTokenExpired = function(input_token){

    return new Promise(resolve => {

        const app_token = mainConfig.app_token;
        const getOptions = {
            url: `https://graph.facebook.com/v3.3/debug_token?input_token=${input_token}&access_token=${app_token}`
        };
        try {
            request.get(getOptions,(err,response,body)=>{
                if(err){
                    console.log(err);
                    resolve(true) ;
                }
                else {
                    const jsonResponse = JSON.parse(body);
                    const date = new Date();
                    if(parseInt(date.getTime()/1000)<jsonResponse.expires_at){
                        console.log('current timestamp '+parseInt(date.getTime()/1000));
                        console.log('token expire timestapm '+jsonResponse.expires_at);
                        resolve(true) ;
                    }
                    else {
                        console.log('token is not expired');
                        resolve(false) ;
                    }
                }
            });
        }
        catch (e) {
            resolve(true) ;
        }
    });

};


InterestController.messageCompose = function(req,res){
    res.render('messageCompose',{});
};

InterestController.bindAccountWithTwitter = function(req,res){
    res.render('bindTwitter',{});
};

InterestController.sendMessage = function(req,res){
    res.send({'msg':'sent'});
};

InterestController.twitterRedirectHandle = function(req,res){
    const oauth_token = req.query.oauth_token;
    const oauth_verifier = req.query.oauth_verifier;

    const oauth_consumer_key=mainConfig.oauth_consumer_key;

    const oauth_nonce = '';
    const oauth_signature = '';

    console.log('2nd step result');
    console.log('oauth_token is '+oauth_token);
    console.log('oauth_verifier is '+oauth_verifier);

    const postOptions = {
        jar:true,
        followAllRedirects:true,
        headers:{
            'Authorization':`OAuth oauth_consumer_key="${oauth_consumer_key}",oauth_token="${oauth_token}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1570634947",oauth_nonce="niATbZ",oauth_version="1.0",oauth_signature="nVnX08kkvsYpNUc9w4YCujae1AY%3D"`
        },
        url:'https://api.twitter.com/oauth/access_token',
        method: 'POST',
        form:{
            oauth_verifier:oauth_verifier
        }
    };
    try {
        request.post(postOptions,(err,response,html)=>{

            if(err){
                console.log('err in twitterRedirectHandle post: '+err);
            }
            else {
                console.log(html);
                res.send(html);
            }
        });
    }
    catch (e) {
        console.log('****** Exception in Converting the request token to an access token post request ******');
        console.log('catch is '+e);
    }

};

InterestController.obtainRequestToken = function(req,res){
    const encoded_redirect_url = encodeURIComponent(mainConfig.redirect_url);
    const oauth_consumer_key = mainConfig.oauth_consumer_key;
    const oauth_token = mainConfig.oauth_token;

    const postOptions = {
        jar:true,
        followAllRedirects:true,
        url:'https://api.twitter.com/oauth/request_token',
        method:'POST',
        headers:{
          'Authorization':`OAuth oauth_consumer_key="${oauth_consumer_key}",oauth_token="${oauth_token}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1570721120",oauth_nonce="sZXwTM",oauth_version="1.0",oauth_signature="wS0f5SipkoPbZ4hlLOCOjH12%2BfE%3D"`
        }

    };
    try {
        request.post(postOptions,(error,response,html)=>{
            if(error){
                console.log('post error: '+error);
            }
            else {
                const jsonResponse = [];
                html.split('&').map(o=>{jsonResponse[o.split("=")[0]] =o.split("=")[1]});
                console.log(jsonResponse);

                const request_oauth_token = jsonResponse['oauth_token'];
                const request_oauth_token_secret = jsonResponse['oauth_token_secret'];
                const oauth_callback_confirmed = jsonResponse['oauth_callback_confirmed'];
                const TWITTER_LINK = 'https://api.twitter.com/oauth/authenticate?oauth_token='+request_oauth_token;
                res.render('bindTwitter',{twitterLoginLink:TWITTER_LINK});
            }
        });
    }
    catch (e) {
        console.log('catch in obtainRequestToken: '+e);
    }


};

InterestController.sendDirectMessage = function(receiverId,msgText){

    var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
    };
    var success = function (data) {
        console.log('Data [%s]', data);
    };

    const twitterConfig = {
        "consumerKey":mainConfig.oauth_consumer_key,
        "consumerSecret": mainConfig.consumer_secret,
        "accessToken": mainConfig.user_access_token, //this should be user access token obatained via redirect thing
        "accessTokenSecret": mainConfig.user_access_token_secret, //this should be user access token obatained via redirect thing
        "callBackUrl": mainConfig.redirect_url
    };
    const twitterClient = new Twitter(twitterConfig);
    twitterClient.postCustomApiCall('/direct_messages/new.json',{user_id: receiverId, 'text':msgText}, error, success);


};

InterestController.testNodeRequest = function(){
    const oauth_consumer_key=mainConfig.oauth_consumer_key;
    const oauth_nonce = '';
    const oauth_signature = '';
    const oauth_token = mainConfig.oauth_token;
    const postOptions = {
        jar:true,
        followAllRedirects:true,
        method:'GET',
        headers:{
            'Authorization':`OAuth oauth_consumer_key="${oauth_consumer_key}",oauth_token=${oauth_token},oauth_signature_method="HMAC-SHA1",oauth_timestamp="1570634947",oauth_nonce="niATbZ",oauth_version="1.0",oauth_signature="nVnX08kkvsYpNUc9w4YCujae1AY%3D"`
        },
        url:'https://api.twitter.com/1.1/followers/ids.json?cursor=-1&screen_name=icclive&count=10'
    };
    try {
        request.get(postOptions,(err,response,html)=>{

            if(err){
                console.log('err in twitterRedirectHandle post: '+err);
            }
            else {
                console.log(html);
                // res.send(html);
            }
        });
    }
    catch (e) {
        console.log('****** Exception in Converting the request token to an access token post request ******');
        console.log('catch is '+e);
    }


};

module.exports = InterestController;