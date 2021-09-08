const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require("bcryptjs");

exports.register = async function(req, res) {
    let errors = [];
    if(!req.body.name || !req.body.email || !req.body.password) {
        errors.push("Please fill in all fields");
    }

    if(req.body.password.length < 6) {
        errors.push("Password should be at least 6 characters");
    }

    if(await User.findOne({email: req.body.email})){
        errors.push("Email already exists.");
    }

    if(errors.length > 0) {// display errors
        res.render('register', { errors: errors });
    } else {// register the user

        try {
            let hashedPassword = await hashPassword(req.body.password);
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            });
            
            await newUser.save();
            req.flash('success_msgs', "You are now registered and can log in");
            return res.redirect('/users/login');
        } catch (err) {
            console.error("Error: " + err);
            errors.push("Server error, Please try again later")
            return res.render('register', {errors: errors});
        }
        
    }
    
}

async function hashPassword(password) {
    try {// hash password
        let salt = await bcrypt.genSalt(10); 
        let hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;

    } catch(err) {
        console.error("Error [hashPassword]: " + err);
    }
};

exports.login = function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
      })(req, res, next);
}