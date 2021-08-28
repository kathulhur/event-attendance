const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventSchema = new Schema({
    name: String
});


module.exports = mongoose.model('Event', EventSchema);