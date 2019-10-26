const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const interestController = require('../src/controller/interestController');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{

    interestController.dashboard(req, res);
  //   res.render('dashboard', {
  //       user: req.user,
  //
  // })
  }
);

router.get('/privacy',  (req, res) =>{
        res.render('privacy');
    }
);

// Fb Login
router.get('/fblogin',  (req, res) =>{
        interestController.obtainRequestToken(req,res);
    }
);

//Callback
router.get('/callback/',  (req, res) =>
    interestController.fbRedirectHandle(req,res)
);

//Campaigns
router.get('/campaigns',  (req, res) =>{
     res.render('campaigns');
    }
);
//Search Interest
router.post('/searchInterest',(req,res)=>{
    interestController.fbInterestAPICall(req,res);
});

//Search Behaviours
router.post('/searchBehaviours',(req,res)=>{
    interestController.fbBehavioursAPICall(req,res);
});

//Send message

router.post('/sendMessage',(req,res)=>{
    interestController.sendMessage(req,res);
});

router.get('/twitterLogin',(req,res)=>{
    interestController.obtainRequestToken(req,res);
});


router.get('/sign-in-with-twitter',(req,res)=>{
    interestController.twitterRedirectHandle(req,res);
});


module.exports = router;
