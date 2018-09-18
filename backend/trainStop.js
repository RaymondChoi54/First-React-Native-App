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
    feed_id: {
        type: Number,
        required: true,
    },
}, {
    collection: 'TrainStops',
});

//Local db: mongodb://localhost/trainstopsdb
mongoose.connect('mongodb://123:123@ds263759.mlab.com:63759/mtatraintrack', (error) => {
    if (error) console.log(error);
    console.log('Database connection successful');
});

module.exports = mongoose.model('TrainStop', trainStopSchema);