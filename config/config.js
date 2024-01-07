const { DATABASE } = require("../constants/constants")
const mongoose = require('mongoose');

console.log('DATABASE URI : ',DATABASE.CONFIG[process.env.NODE_ENV.toUpperCase()].MONGO_URI)
mongoose.connect(DATABASE.CONFIG[process.env.NODE_ENV.toUpperCase() || 'DEVELOPMENT'].MONGO_URI);
mongoose.connection.on('error', function (err) {
  console.log(err);   
  console.log('Unable to connect to db...', err.message);
  process.exit();
});

mongoose.connection.once('open', function () {
  console.log('DB CONNECTED');
});

