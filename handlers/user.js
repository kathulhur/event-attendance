const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require("bcryptjs");

exports.register = async function(req, res) {
    
    try {
        let hashedPassword = await hashPassword(req.body.password);
        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
    
        await newUser.save();
        res.redirect('/users/login');
    } catch (err) {
        console.error("Error: " + err);
        res.render('register', {error: "Errors goes here"});
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

exports.login = function (req, res) {
    
}