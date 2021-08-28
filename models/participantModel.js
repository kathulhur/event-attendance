let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ParticipantSchema = new Schema({
    event: { type: mongoose.Types.ObjectId, ref: 'Event'},
    name: String
});

module.exports = mongoose.model('Participant', ParticipantSchema);