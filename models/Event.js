const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'incoming'
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    participants: {
        type: Number,
        default: 0
    }

});


module.exports = mongoose.model('Event', EventSchema);