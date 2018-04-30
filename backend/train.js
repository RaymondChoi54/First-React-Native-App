const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainStopSchema = new Schema({
  trip_id: {
    type: String,
    required: true,
    unique: true,
  },
  route_id: {
    type: String,
    required: true,
  },
  stop_time_update: {
    type: [Object],
  },
}, {
  collection: 'TrainStops',
});

mongoose.connect('mongodb://localhost/coursesdb', (error) => {
  if (error) console.log(error);
  console.log('Database connection successful');
});

module.exports = mongoose.model('TrainStop', trainStopSchema);