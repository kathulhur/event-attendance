const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const db = require('./db');
const User = require('../models/User');


async function verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);// returns boolean value
}

module.exports = function (passport) {
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
                    console.log('hey');
                    return done(null, false, { message: 'Incorrect password.' });
                }
                console.log('hey');
                return done(null, user);// user authenticated
            } catch (err) {
                console.log("Error [auth]: " + err);
                return done(err);
            }
        }
            
    ));
}
