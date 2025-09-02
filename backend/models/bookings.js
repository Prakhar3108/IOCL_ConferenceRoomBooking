const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  room: String,
  date: String,
  fromTime: String,
  toTime: String,
  status: {
    type: String,
    default: 'pending' // pending | approved
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
