const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    authId: String,
    name: String,
    email: String,
    role: String,
    created: Date,
});

module.exports = mongoose.model('User', UserSchema);