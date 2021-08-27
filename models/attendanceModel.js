let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let attendanceSchema = new Schema({
    event: { type: mongoose.Types.ObjectId, ref: 'Event'},
    name: String,
    age: Number,
    professionalStatus: String,
    institution: String,
    course: String,
    submitted: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Attendance', attendanceSchema);