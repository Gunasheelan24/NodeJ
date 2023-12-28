const { Schema, model } = require('mongoose');

const tourSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  fromAirportCode: {
    type: String,
    required: true,
  },
  toAirportCode: {
    type: String,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  gst: {
    type: Number,
    required: true,
  },
  incurence: {
    type: Number,
  },
  adult: {
    type: Number,
    default: 1,
    required: true,
  },
  flightName: {
    type: String,
  },
  flightNumber: {
    type: String,
  },
  travelTime: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  bookingHistory: {
    type: Array,
  },
});

exports.tourModel = model('tourModel', tourSchema);
