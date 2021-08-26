const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventSchema = new Schema({
    name: String,
    slug: String,
    code: String,
    description: String,
    venue: String,
    eventStart: Date,
    eventEnd: Date,
    created: { type: Date, default: Date.now() }
});


module.exports = mongoose.model('Event', EventSchema);