const request = require('request');
const mainConfig = require('../../config/mainConfig');
const InterestController = {};

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

InterestController.sendMessage = function(req,res){
    res.send({'msg':'sent'});
};

module.exports = InterestController;