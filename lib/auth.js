const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const db = require('./db');
const User = require('../models/User');


async function verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);// returns boolean value
}

exports.configure = function (passport) {
        passport.use(new LocalStrategy({
            usernameField: "email"
        },
        async function(email, password, done) {
            try {
                let user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: 'Email does not exist.' });
                }
                if (!await verifyPassword(password, user.password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                console.log("ID: " + user);
                return done(null, user);// user authenticated
            } catch (err) {
                console.log("Error [auth]: " + err);
                return done(err);
            }
        }
            
    ));

    passport.serializeUser(function(user, done) {
        console.log("serializer: " + user);
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        console.log("deserializer: " + id);
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

exports.ensureAuthenticated = function (req, res, next) {
    console.log("authenticated: " + req.isAuthenticated());
    if(req.isAuthenticated()) {
        return next();
    }
    // req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/users/login');
}
