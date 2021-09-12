const mongoose = require('mongoose');
const Participant = require('../models/Participant');
const db = require('../lib/db');

exports.register = async function (req, res, next) {
    let errorExists = false;
    if(!req.body.name || !req.body.age || !req.body.course || !req.body.institution) {
        errorExists = true;
        req.flash('error_msgs', "Please fill all the fields");
    }
    if(req.body.age < 12) {
        errorExists = true;
        req.flash('error_msgs', "You should be atleast 12 years old to register");
    }

    if(errorExists){// if there are errors
        return res.redirect(`/events/${req.params.eventSlug}`);
    } else {// register the participant
        try {
            await db.participant.createParticipant(req.body);
            req.flash('success_msgs', "Registration successful.");
            return res.redirect(`/events/${req.params.eventSlug}`);
        } catch (err) {
            console.log('Error : ' + err);
            return next(err);
        }
    }

}