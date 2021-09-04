const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const db = require('./db');

passport.serializeUser( (user, done) => done(null, user._id));

passport.deserializeUser( (user, done) => {
    db.user.getUserById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

module.exports = (app, options) => {
    // if success and failure redirects aren't specified,
    // set some reasonable defaults
    if(!options.successRedirect) options.successRedirect = '/account'
    if(!options.failureRedirect) options.failureRedirect = '/login'
    return {
        init: function() { /* TODO */ },
        registerRoutes: function() { /* TODO */ },
    }
}