const router = require('express').Router();
const verify = require('./verify');

router.get('/', verify, (req, res) => {
    res.render('home.ejs');
});

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.get('/register', (req, res) => {
    res.render('register.ejs');
});


module.exports = router;