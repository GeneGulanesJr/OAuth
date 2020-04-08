const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login',(req, res)=>{
    res.render('login', {user: req.user});
});

// auth logout
router.get('/logout',(req, res)=>{
    // handle with passport
    // res.send('logging out');
    req.logout();
    res.redirect('/');
});

// auth with google
router.get('/google',passport.authenticate('google',{
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/callback',passport.authenticate('google'),(req, res)=>{
    //res.send('you reached the callback URI');
    //res.send(req.user);    
    res.redirect('/profile/');
});



router.get('/facebook',
    passport.authenticate('facebook'));

router.get('/facebook/callback',passport.authenticate('facebook'),(req, res)=>{
    res.redirect('/profile/');
});











router.get('/spotify', passport.authenticate('spotify'), function(req, res) {
});
router.get('/spotify/callback',passport.authenticate('spotify'),(req, res)=>{
    res.redirect('/profile/');
});

router.get('/steam', passport.authenticate('steam'), function(req, res) {
});
router.get('/steam/callback',passport.authenticate('steam'),(req, res)=>{
    res.redirect('/profile/');
});

router.get('/twitch', passport.authenticate('twitch'), function(req, res) {
});
router.get('/twitch/callback',passport.authenticate('twitch'),(req, res)=>{
    res.redirect('/profile/');
});



module.exports = router;