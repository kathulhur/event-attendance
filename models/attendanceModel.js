let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let attendanceSchema = new Schema({
    event: mongoose.Types.ObjectId,
    name: String,
    age: Number,
    professionalStatus: String,
    institution: String,
    course: String,
    submitted: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('attendance', attendanceSchema);