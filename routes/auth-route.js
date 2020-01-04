const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login',(req, res) => {
    res.json()
});

// auth logout
router.get('/logout',(req, res) => {

});

router.get('/google', passport.authenticate('google', { 
    scope: ['profile'] 
}));

router.get('/redirect', passport.authenticate('google'), (req, res) => { 
    res.redirect('/desk/upload');
});

module.exports = router;