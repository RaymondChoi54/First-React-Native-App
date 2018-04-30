const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainStopSchema = new Schema({
  route_id: {
    type: String,
    required: true,
  },
  stop_id: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
  },
  arrival: {
    type: Number,
    required: true,
  },
}, {
  collection: 'TrainStops',
});

mongoose.connect('mongodb://localhost/trainstopsdb', (error) => {
  if (error) console.log(error);
  console.log('Database connection successful');
});

module.exports = mongoose.model('TrainStop', trainStopSchema);