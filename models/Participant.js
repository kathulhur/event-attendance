let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ParticipantSchema = new Schema({
    event: {
        type: mongoose.Types.ObjectId, 
        required: true,
        ref: 'Event'
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    registered: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Participant', ParticipantSchema);