// Connect to the database
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connection successful');
});
