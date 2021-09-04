// Connect to the database
const mongoose = require('mongoose');
const {credentials} = require('./config');
const UserModel = require('./models/User');

process.env.MONGODB_URI = credentials.MONGODB_URI;

if(!process.env.MONGODB_URI) { // checks if the uri is present
  console.error('MongoDB connection string missing!');
  process.exit(1);
}

exports.connect = function() {
  mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {
    console.log('Database connection successful');
  });
}



